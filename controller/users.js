const sha256 = require('sha256')
const users = require("../models/users.model.js")
const jwt = require('../utils/jwt.js')
const { VERIFY, SIGN } = jwt
const { EMAIL } = require('../middleware/nodemailer.js')
const path = require("path")
module.exports = {
REGISTER: async (req, res) => {
try {
const { username,password, email, gender } = req.body
if(!username || !password || !email || !gender) throw new Error("The data is not full")
else{
    req.body.password = sha256(password)
    const user = await users.post(req.body)
    await EMAIL(email)
    res.send({status: 200, token: SIGN(user._id.toString()), route: '/chat'})
}
} catch (err) {
    res.send({status: 401, message: err.message})
}
},
LOGIN: async (req, res) =>{
try {
    const { email, password } = req.body
    const user = await users.get("", {email, password: sha256(password)}, {_id: true})
res.send({status: 200, token: SIGN(user[0]._id.toString()), route: '/chat'})
} catch (err) {
    res.send({status: 401, message: err.message})
}
},
CHECK: async (req, res) => {
    try{
const { token } = req.headers
if(!token) throw new Error("Please enter token")
res.send({status: 200, user_id: (await VERIFY(token)).id})
    }catch(err){
        return res.send({status:404, message: err.message})
    }
},
FILE: async (req, res) => {
    try{
let { file } = req.files
const { token } = req.headers
const { count } = req.body
if((await VERIFY(token)).id){
let mimetype = file.name.split('.')
mimetype = mimetype[mimetype.length - 1]
file.name = file.name.split('.')[0]
file.mv(path.join(process.cwd(), 'public', 'message-images', file.name + token+count + '.' + mimetype), function (err){
    if(err) console.log(err)
})
return res.send({status: 200, message: 'added'})}
    }catch(err){
        return res.send({status:404, message: err.message})
    }
},
UPDATE_USERS: async (req, res) => {
    try{
    const { username } = req.body
    // let { file } = req.files
    const { token } = req.headers
    if(!token) throw new Error("token is required")
    if( !username && !req.files.file ) throw new Error('Please make changes')
else{
if((await VERIFY(token)).id){
    if(await users.get((await VERIFY(token)).id)){
        if(req.files && username) {
            await users.update((await VERIFY(token)).id, '', {username, imgLink:'/images/' + req.files.file.name.split('.')[0] + token +'.' + req.files.file.name.split('.')[req.files.file.name.split('.').length - 1]})
            let mimetype = req.files.file.name.split('.')
            mimetype = mimetype[mimetype.length - 1]
            let pathname = req.files.file.name.split('.')[0] + token +'.' + mimetype
            req.files.file.mv(path.join(process.cwd(), 'public', 'images', pathname))    
        }
    else if(req.files && !username) {
        let mimetype = req.files.file.name.split('.')
        mimetype = mimetype[mimetype.length - 1]
        let pathname = req.files.file.name.split('.')[0] + token +'.' + mimetype
        req.files.file.mv(path.join(process.cwd(), 'public', 'images', pathname))
        await users.update((await VERIFY(token)).id, '', { imgLink: '/images/' + pathname})}
else if(!req.files && username) await users.update((await VERIFY(token)).id, '', {username})
res.send({status:200})
}
}
}
}catch(err){
    return res.send({status: 404, message: err.message})
}
},
CHECK_TOKEN: async (req, res) => {
    try{
const { token } = req.headers
if(!((await VERIFY(token)).id)) throw new Error("Expired token")
else return res.send({status: 200})
}catch(err){
        return res.send({status:404, message: err.message})
    }
}
}