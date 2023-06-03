const path = require('path')

module.exports = {
FILE: async (req, res, next) => {
if(req.files){    
const file = req.files.avatar
const { username } = req.body
const random = Math.floor(Math.random() * 9000 + 1000)
let mimetype = file.name.split('.')
mimetype = mimetype[mimetype.length - 1]
const link = path.join('images', username + random + '.' + mimetype)
 file.mv(path.join(process.cwd(), 'public', link))
req.body.imgLink = link
}
else {
    if(req.body.gender == 'male'){
 req.body.imgLink = '/images/boy.jpg'
    }
    else {
 req.body.imgLink = '/images/girl.jpg'
    }
}
return next()
}
}