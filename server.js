const usersDb = require("./models/users.model.js")
const postsDb = require("./models/posts.model.js")
const groupsDb = require('./models/groups.model.js')
const config = require("config")
const express = require("express")
const app = express()
const fs = require("fs")
const path = require('path')
const fileupload = require("express-fileupload")
const PORT = config.get('port') || 3000
const userRoute = require('./router/users.routes.js')
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { VERIFY } = require("./utils/jwt.js")
const io = new Server(server);

require('./db/mongoose.js')
app.use(express.static(path.join(process.cwd(), 'public')))
app.use(express.json())
app.use(fileupload())
// app.use(express.urlencoded({ extended: false }));
app.use(userRoute)


const checkfile = filename => {
    return path.join(process.cwd(), 'views', filename + '.html')
}

app.get("*", (req, res) => {
    try {
        const url = req.url.split("/")
        const route = url[1].toLocaleLowerCase()
       if(route == '') return res.redirect('/chat')
        else if(!['login', 'register', 'chat'].includes(route)) throw new Error('The route doesn not exist')
    else return res.sendFile(checkfile(route))
} catch (err) {
    return res.send({status: 404, message: err.message})
}    

})

io.on('connection', async socket => {
    socket.on('activeUser', async token => {
    const userId = (await VERIFY(token)).id
    if(userId){
 if(await usersDb.get(userId)){
    await usersDb.update(userId, '', {active: true, active_id: socket.id})
    io.emit('connectionUsers', await [...(await usersDb.get()), ...(await groupsDb.find())])
}
    }
})
socket.on('connectRoom', async room => {
    socket.join(room)
})
socket.on('disconnect', async () => {
        const userActive = await usersDb.get('', {active_id: socket.id})
     if(userActive.length >0){
        const foundId = userActive[0]._id
      await (await usersDb.update(foundId,'',{active: false}))
        io.emit('connectionUsers', [...(await usersDb.get()), ...(await groupsDb.find())])
    }
})
    io.emit('connectionUsers', await [...(await usersDb.get()), ...(await groupsDb.find())])
    socket.on("newGroup", async data => {
        await groupsDb.post(data)
        io.emit('connectionUsers', await [...(await usersDb.get()), ...(await groupsDb.find())])
    })
// io.emit('messages', messages)
socket.on('findUser', async userId => {
const foundUser = await usersDb.get(userId)
socket.emit('userInfo',  foundUser )
})
socket.on("resendMessages", async () => {
    socket.emit('get_messages', await postsDb.find())
})
socket.on('connectionUser', async token =>{
    const obj = await VERIFY(token)
    if(obj.id){
const user = await usersDb.get(obj.id)
 socket.emit('on', user)
    }
    else return socket.emit('off')
})
socket.on('newMessage', async data => {
    if((await VERIFY(data.user_id)).id){
        data.user_id = (await VERIFY(data.user_id)).id
        data.date = Date(new Date()).split(" ")[4].slice(0, 5)
    await postsDb.post(data)
   if(data.to) io.emit('messages', (await postsDb.find()))
else if(data.room) io.to(data.room).emit('messages', (await postsDb.find()))
}})

socket.on('editMessage', async (obj, id) => {
   await postsDb.update(id, '',obj)
   io.emit('messages', await postsDb.find())
})

socket.on('deleteMessage', async id => {
    const picture = (await postsDb.find(id)).file
  if(picture) fs.unlinkSync(__dirname + '/public' + picture)
    await  postsDb.delete(id)
  io.emit('messages', await postsDb.find())
})
})

server.listen(PORT, () => {
    console.log('The server is running under '+PORT);
})

