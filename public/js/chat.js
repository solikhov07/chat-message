const url = 'http://localhost:5000'
const profileBoxUser = document.querySelector('.profile-chat-user')
const btnBackToUsers = document.querySelector(".btn-back-to-users")
const userChatAvatarProfile = document.querySelector('.user-profile-chat-avatar')
const userChatUsernameProfile = document.querySelector('.user-profile-chat-username')
const membersText = document.querySelector('.members-text')
const avatar = document.querySelector(".profile-img")
const profileUsername = document.querySelector('.profile-username')
const boxUsers = document.querySelector('.box-users')
const chatBox = document.querySelector('.chat-box')
const usersContainer = document.querySelector(".users")
const boxMessages = document.querySelector(".box-messages")
const backgroundBox = document.querySelector('.background-shadow-box')
const profileManagementBox = document.querySelector('.profile-edit-box')
const btnEditProfile = document.querySelectorAll('.btn-edit-profile')
const btnAddGroup = document.querySelector('.circle-add-group')
const groupBoxCreate = document.querySelector(".create-group-box")
const btnCloseGroup = document.querySelector('.btn-close-group')
const btnCreateGroup = document.querySelector('.btn-create-group')
const inputNewGroupAvatar = document.querySelector('#group-new-avatar')
const inputNewGroupName = document.querySelector('.input-new-group-username')
const btnCloseEdit = document.querySelector('.btn-close-edit-box')
const inputText = document.querySelector(".input-text")
const microBtn = document.querySelector(".micro-btn")
const file = document.getElementById("file")
const fileCount = document.querySelector('.file-count')
const btnSend = document.querySelector(".btn-send-message")
const token = localStorage.getItem("token")
const showImgBox = document.querySelector('.img-show-box')
const btnCloseImgShow = document.querySelector('.btn-close-img-box')
const img = document.querySelector('.img-messages')


const inputEditUsername = document.querySelector(".edit-profile-username")
const imgEditAvatar = document.querySelector('.img-avatar-edit')
const inputEditFile = document.querySelector(".input-file-profile")
const btnChange = document.querySelector(".btn-edit-profile-submit")
const searchInput = document.querySelector('.search-input-user')
searchInput.addEventListener('input', () => {
document.querySelectorAll(".users > div").forEach(e => {
if(!(e.lastChild.textContent.toLocaleLowerCase().indexOf(searchInput.value.toLocaleLowerCase()) == -1 )){
    e.style.display = 'flex'
}
else{
    e.style.display = 'none'
}
})
})
// ;(async  () => {
// try{
// const request = await fetch(url + '/check_token',{
// method: 'GET',    
// headers: {
//         token
//     }
// })
// const reply = await request.json()
// if(reply.status == 404) window.location = '/login'
// }catch(err){
    //     alert(err.message)
    // }
// })()

if(!token){
    window.location = '/login'
}
let socket = io()
socket.emit("connectionUser", localStorage.getItem('token'))
socket.on("on", async user => {
if(user){    avatar.src =  user.imgLink
    profileUsername.innerHTML = user.username
imgEditAvatar.src = user.imgLink
inputEditUsername.value = user.username}
})

socket.on('off', () => {
    localStorage.clear()
    window.location = '/login'
})

if(localStorage.getItem('count')){
    count = localStorage.getItem('count')
}
else {
    count = 0 
}
if(!localStorage.getItem('acceptance')){
state = false
}
else{
    state = true
}
if(!state){
    alert('If you want to use the site, You have to swear that you will never offend someone')
    localStorage.setItem('acceptance', 'confirmed')
}
let listen = new webkitSpeechRecognition()
listen.lang = "en-US"
microBtn.onclick = () => {
    listen.start()
}

listen.onresult = (event) => {
    let arg = event.results[0][0].transcript
    inputText.value = arg
}




socket.emit('activeUser', token)

socket.on('connectionUsers', async users => {
    if(users.length > 0){
        membersText.textContent = users.length + ' memebers'
        const response = await fetch(url + '/check', {
            method: 'GET',
            headers: {
                token
            }
        })
        const data = await response.json()
        usersContainer.innerHTML = ''
    users.forEach( e => {
        if(e._id != data.user_id){
            if(e.username && e.email && e.gender && e.password && e.username  && e.active_id){
        const userBox = document.createElement("div")
        usersContainer.append(userBox)
    const divUserAvatarBox = document.createElement("div")
    divUserAvatarBox.classList.add("username-box")
    userBox.append(divUserAvatarBox)
    userBox.setAttribute("data-user_id", e._id)
    const userAvatarImg = document.createElement("img")
    userAvatarImg.src= e.imgLink
    divUserAvatarBox.append(userAvatarImg)
     const activeBox = document.createElement("div")
     divUserAvatarBox.append(activeBox)
     activeBox.style.padding = '4px 5px'
     activeBox.style.borderRadius = '50%'
     activeBox.style.alignSelf = 'flex-end'
     if(e.active == true){
        activeBox.style.background = 'chartreuse'
     }
     else{
        activeBox.style.background = 'gray'
     }
const divUserUsername = document.createElement('div')
const userUsernameText = document.createElement('h3')
userBox.append(divUserUsername)
userUsernameText.innerHTML = e.username
divUserUsername.append(userUsernameText)
}
else{
    const userBox = document.createElement("div")
    usersContainer.append(userBox)
const divUserAvatarBox = document.createElement("div")
divUserAvatarBox.classList.add("username-box")
userBox.append(divUserAvatarBox)
userBox.setAttribute("data-group_id", e._id)
const userAvatarImg = document.createElement("img")
userAvatarImg.src= e.imgLink
divUserAvatarBox.append(userAvatarImg)
const divUserUsername = document.createElement('div')
const userUsernameText = document.createElement('h3')
userBox.append(divUserUsername)
userUsernameText.innerHTML = e.group_name
divUserUsername.append(userUsernameText)
}
    }})}
})

file.addEventListener('input', () => {
    if(file.files.length > 0){
fileCount.style.display = 'inline'
    }
    else{
fileCount.style.display = 'none'
    }
})

btnSend.addEventListener("click", async e => {
    const formdata = new FormData()
    socket.emit("connectionUser", localStorage.getItem('token'))
    if(file.files.length > 0){
        count += 1
        localStorage.setItem('count', count)
    formdata.append('file',file.files[file.files.length - 1])
    formdata.append('count', count)
    const response = await fetch(url + '/file',{
            method: 'POST',
            headers: {
                token
            },
            body: formdata
        })
        const data = await response.json()
    }
 if((inputText.value.length > 0 || file.files.length > 0) && (localStorage.getItem('user_direct') || localStorage.getItem('group')) && localStorage.getItem('token') )   socket.emit('newMessage',  {message: inputText.value, user_id: token, avatar: avatar.src, file: (file.files.length > 0 ?   '/message-images/' + file.files[file.files.length - 1].name.split('.')[0] + token + count +'.' + file.files[file.files.length - 1].name.split('.')[file.files[file.files.length - 1].name.split('.').length - 1] : undefined), to: localStorage.getItem("user_direct") ? localStorage.getItem("user_direct") : undefined, room: localStorage.getItem("group")? localStorage.getItem("group") : undefined})
 else alert('Write a message')
 inputText.value = ''
    file.value = null
    fileCount.style.display = 'none'
})
async function render(messages){
    const response = await fetch(url + '/check', {
        method: 'GET',
        headers: {
            token
        }
    })
    const data = await response.json()
    if(messages){
       boxMessages.innerHTML = ''
        messages.forEach(e => {
        if((e.user_id == data.user_id && e.to == localStorage.getItem("user_direct") && !e.room) || (e.room == localStorage.getItem('group') && e.user_id == data.user_id && !e.to)){
            if(!e.file && e.message.length){
            const divMessage = document.createElement('div')
            boxMessages.append(divMessage)
            divMessage.classList.add("row-message-own")
            const message = document.createElement('div')
            divMessage.append(message)
            message.classList.add("message-own")
            const coverBox = document.createElement("div")
            message.append(coverBox)
            const messageBox = document.createElement('div')
            coverBox.append(messageBox)
            coverBox.style.width = '100%'
            messageBox.classList.add("message-box-own")
            const dateBox = document.createElement("div")
            messageBox.append(dateBox)
            dateBox.classList.add("date-box")
            const spanDate = document.createElement('span')
dateBox.append(spanDate)
spanDate.innerHTML = e.date
const textBox = document.createElement("div")
messageBox.append(textBox)
textBox.classList.add("text-box")
const spanMessage = document.createElement("span")
textBox.append(spanMessage)
spanMessage.classList.add("text-message")
spanMessage.innerHTML = `${(e.message).includes('<', '>', '/') ? JSON.stringify(e.message.split("")) : e.message}`
const messageContrBox = document.createElement("div")
coverBox.append(messageContrBox)
messageContrBox.classList.add("message-controller")
const manageIconBox = document.createElement("div")
messageContrBox.append(manageIconBox)
const btnEdit = document.createElement("button")
manageIconBox.append(btnEdit)
btnEdit.innerHTML = `<i data-btn-edit=${e._id} class="fa-solid fa-pen-to-square"></i>`
const btnDeleteMes = document.createElement("button")
btnDeleteMes.style.color = 'red'
btnEdit.style.color = 'orange'
manageIconBox.append(btnDeleteMes)
btnDeleteMes.innerHTML = `<i data-btn-delete=${e._id} class="fa-sharp fa-solid fa-trash"></i>`
const imgBox = document.createElement("div")
message.append(imgBox)
imgBox.classList.add("message-avatar")
const imgAvatar = document.createElement('img')
imgBox.append(imgAvatar)
imgAvatar.src = e.avatar
btnEdit.addEventListener('click', a => {
    if(spanMessage.hasAttribute('contenteditable')){
        spanMessage.removeAttribute('contenteditable')
        socket.emit("editMessage", {message: spanMessage.textContent}, e._id)
        spanMessage.style.border = 'none'
    }
    else{
        spanMessage.setAttribute('contenteditable', true)
        spanMessage.style.border = '1px solid dodgerblue'
    }
})}
else if((e.file.includes('png') || e.file.includes('jpg') || e.file.includes('svg'))  && e.message.length == 0){
    const divMessage = document.createElement('div')
    boxMessages.append(divMessage)
    divMessage.innerHTML = `
    <div class='row-message-own'>
            <div class='message-own-img'>
            <div style='width: 100%;'>
            <div  class='img-box-own'>
            <div class='date-box'>
            <span class='message-date'><i style='font-size: 12px; color: white;'>${e.date}</i></span>
            </div>
           <div data-images=${e.file} class='mes-img'>
           <img data-images=${e.file} src='${e.file}' alt='' />
           </div>
        </div>
        <div class='img-controller'>
        <div>
        <i style='cursor:pointer; color: red;' data-btn-delete=${e._id} class="fa-sharp fa-solid fa-trash"></i>
        </div>
        </div>
        </div>
        <div class='message-avatar'>
        <img src=${e.avatar} />
        </div>
        </div>
        </div>
        `
}

else if(e.file.includes('mp4')  && e.message.length == 0){
    const divMessage = document.createElement('div')
    boxMessages.append(divMessage)
    divMessage.innerHTML = `
    <div class='row-message-own'>
            <div class='message-own-img'>
            <div style='width: 100%;'>
            <div  class='img-box-own'>
            <div class='date-box'>
            <span class='message-date'><i style='font-size: 12px;color: white;'>${e.date}</i></span>
            </div>
           <div class='mes-img'>
           <video  loop src=${e.file} controls='controls'></video>
           </div>
        </div>
        <div class='img-controller'>
        <div>
        <i style='cursor:pointer; color: red;' data-btn-delete=${e._id} class="fa-sharp fa-solid fa-trash"></i>
        </div>
        </div>
        </div>
        <div class='message-avatar'>
        <img src=${e.avatar} />
        </div>
        </div>
        </div>
        `
}
else if((e.file.includes('png') || e.file.includes('jpg') || e.file.includes('svg'))  && e.message.length){
    const divMessage = document.createElement('div')
    boxMessages.append(divMessage)
    divMessage.innerHTML = `
    <div class='row-message-own'>
            <div class='message-own-img'>
            <div style='width: 100%;'>
            <div  class='img-box-own'>
            <div class='date-box'>
            <span class='message-date'><i style='font-size: 12px; color: white;'>${e.date}</i></span>
            </div>
           <div data-images=${e.file} class='mes-img'>
           <img data-images=${e.file} src='${e.file}' alt='' />
           </div>
        </div>
        <div style='width:100%; padding: 5px; overflow: hidden ;background: chartreuse; color: white;'>
        <span>${(e.message).includes('<', '>', '/') ? JSON.stringify(e.message.split("")) : e.message}</span>
        </div>
        <div class='img-controller'>
        <div>
        <i style='cursor:pointer; color: red;' data-btn-delete=${e._id} class="fa-sharp fa-solid fa-trash"></i>
        </div>
        </div>
        </div>
        <div class='message-avatar'>
        <img src=${e.avatar} />
        </div>
        </div>
        </div>
        `
}
else if(e.file.includes('mp4')  && e.message.length){
    const divMessage = document.createElement('div')
    boxMessages.append(divMessage)
    divMessage.innerHTML = `
    <div class='row-message-own'>
            <div class='message-own-img'>
            <div style='width: 100%;'>
            <div  class='img-box-own'>
            <div class='date-box'>
            <span class='message-date'><i style='font-size: 12px; color: white;'>${e.date}</i></span>
            </div>
           <div class='mes-img'>
           <video  loop controls src=${e.file}></video>
           </div>
        </div>
        <div style='width:100%; padding: 5px; overflow: hidden ;background: chartreuse; color: white;'>
        <span>${(e.message).includes('<', '>', '/') ? JSON.stringify(e.message.split("")) : e.message}</span>
        </div>
        <div class='img-controller'>
        <div>
        <i style='cursor:pointer; color: red;' data-btn-delete=${e._id} class="fa-sharp fa-solid fa-trash"></i>
        </div>
        </div>
        </div>
        <div class='message-avatar'>
        <img src=${e.avatar} />
        </div>
        </div>
        </div>
        `
}
    }
    if((e.user_id == localStorage.getItem("user_direct") && e.to == data.user_id && !e.room) || (e.room == localStorage.getItem('group') && e.user_id != data.user_id && !e.to)){
if(!e.file && e.message.length){
        const divMessage = document.createElement('div')
            boxMessages.append(divMessage)
            divMessage.classList.add("row-message")
            divMessage.innerHTML = `
        <div class='message'>
        <div data-images=${e.avatar} class='message-avatar'>
        <img data-zimages=${e.avatar} src=${e.avatar} />
        </div>
        <div class='message-box'>
        <div class='date-box'>
        <span class='message-date'><i style='font-size: 12px; color: white;'>${e.date}</i></span>
        </div>
        <div class='text-box'>
        <span>${(e.message).includes('<', '>', '/') ? JSON.stringify(e.message.split("")) : e.message}</span>
        </div>
        </div>
        </div>
        `
    }
    else if((e.file.includes('png') || e.file.includes('jpg') || e.file.includes('svg'))  && e.message.length == 0){
        const divMessage = document.createElement('div')
        boxMessages.append(divMessage)
        divMessage.innerHTML = `
        <div class='row-message'>
                <div class='message-img'>
                <div data-images=${e.avatar} class='message-avatar'>
            <img data-images=${e.avatar} src=${e.avatar} />
            </div>
                <div style='width: 100%; border-radius: 8px; overflow: hidden;'>
                <div  class='img-box'>
                <div class='date-box'>
                <span class='message-date'><i style='font-size: 12px; color: white;'>${e.date}</i></span>
                </div>
               <div data-images=${e.file} class='mes-img'>
               <img data-images=${e.file} src='${e.file}' alt='' />
               </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            `
            
    }
    else if(e.file.includes('mp4')  && e.message.length == 0){
        const divMessage = document.createElement('div')
        boxMessages.append(divMessage)
        divMessage.innerHTML = `
        <div class='row-message'>
                <div class='message-img'>
                <div data-images=${e.avatar} class='message-avatar'>
            <img data-images=${e.avatar} src=${e.avatar} />
            </div>
                <div style='width: 100%; border-radius: 8px; overflow: hidden;'>
                <div  class='img-box'>
                <div class='date-box'>
                <span class='message-date'><i style='font-size: 12px; color: white;'>${e.date}</i></span>
                </div>
               <div class='mes-img'>
           <video  loop controls src=${e.file}></video>
               </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            `
            
    }
else if((e.file.includes('png') || e.file.includes('jpg') || e.file.includes('svg'))  && e.message.length){
    const divMessage = document.createElement('div')
    boxMessages.append(divMessage)
    divMessage.innerHTML = `
    <div class='row-message'>
            <div class='message-img'>
            <div data-images=${e.avatar} class='message-avatar'>
        <img data-images=${e.avatar} src=${e.avatar} />
        </div>
            <div style='width: 100%; border-radius: 8px; overflow: hidden;'>
            <div  class='img-box'>
            <div class='date-box'>
            <span class='message-date'><i style='font-size: 12px; color: white;'>${e.date}</i></span>
            </div>
           <div data-images=${e.file} class='mes-img'>
           <img data-images=${e.file} src='${e.file}' alt='' />
           </div>
        </div>
        <div style='width:100%; padding: 5px; overflow: hidden ;background: black; color: white;'>
        <span>${(e.message).includes('<', '>', '/') ? JSON.stringify(e.message.split("")) : e.message}</span>
        </div>
        </div>
        </div>
        </div>
        `

}
else if(e.file.includes('mp4')  && e.message.length){
    const divMessage = document.createElement('div')
    boxMessages.append(divMessage)
    divMessage.innerHTML = `
    <div class='row-message'>
            <div class='message-img'>
            <div data-images=${e.avatar} class='message-avatar'>
        <img data-images=${e.avatar} src=${e.avatar} />
        </div>
            <div style='width: 100%; border-radius: 8px; overflow: hidden;'>
            <div  class='img-box'>
            <div class='date-box'>
            <span class='message-date'><i style='font-size: 12px;'>${e.date}</i></span>
            </div>
           <div class='mes-img'>
           <video  loop controls src=${e.file}></video>
           </div>
        </div>
        <div style='width:100%; padding: 5px; overflow: hidden ;background: black; color: white;'>
        <span>${(e.message).includes('<', '>', '/') ? JSON.stringify(e.message.split("")) : e.message}</span>
        </div>
        </div>
        </div>
        </div>
        `

}

}
// else boxMessages.innerHTML = ''
})}
boxMessages.scrollTop = boxMessages.scrollHeight
}

socket.on('messages', async messages => {
    render(messages)
})

boxMessages.addEventListener('click', e => {
    if(e.target.hasAttribute('data-btn-delete')){
  let found = e.target.dataset.btnDelete
  socket.emit('deleteMessage', found)
    }
    else if(e.target.hasAttribute('data-images')){
        if(backgroundBox.style.display == 'none' && showImgBox.style.display == 'none'){
    showImgBox.style.display = 'flex'
    backgroundBox.style.display = 'block'
img.src = e.target.dataset.images
}
showImgBox.addEventListener('click', () => {
    if(backgroundBox.style.display == 'block' && showImgBox.style.display == 'flex'){
        backgroundBox.style.display = 'none' 
     showImgBox.style.display = 'none'
    }
})
btnCloseImgShow.addEventListener('click', () => {
    if(backgroundBox.style.display == 'block' && showImgBox.style.display == 'flex'){
        backgroundBox.style.display = 'none' 
     showImgBox.style.display = 'none'
    }
})
    }
})
usersContainer.addEventListener('click', async e => {
    if(e.target.hasAttribute("data-user_id")){
     window.localStorage.removeItem('user_direct')
localStorage.removeItem("group")
     
     if(document.body.clientWidth < 550){
        boxUsers.style.display = 'none'
        chatBox.style.display = 'block'
        profileBoxUser.style.display = 'flex' 
    }
    socket.emit("findUser", e.target.dataset.user_id)
     window.localStorage.setItem('user_direct', e.target.dataset.user_id)
     socket.emit('resendMessages'); 
 socket.on('get_messages', messages => {
  if(messages) render(messages)
})
}
if(e.target.hasAttribute('data-group_id')){
localStorage.removeItem("user_direct")
localStorage.removeItem("group")
localStorage.setItem('group', e.target.dataset.group_id)
if(document.body.clientWidth < 550){
    boxUsers.style.display = 'none'
    chatBox.style.display = 'block'
    profileBoxUser.style.display = 'flex' 
}
socket.emit('connectRoom', localStorage.getItem('group'))
socket.emit('resendMessages'); 
socket.on('get_messages', messages => {
 if(messages) render(messages)
})
}
})

socket.on('userInfo', data => {
    userChatAvatarProfile.src = data.imgLink  
    userChatUsernameProfile.textContent = data.username
})

btnEditProfile.forEach(e => {
    e.addEventListener('click', () => {
        if(profileManagementBox.style.display == 'none' && backgroundBox.style.display == 'none'){
            profileManagementBox.style.display = 'flex'
            backgroundBox.style.display = 'block'
        }
        })
})

backgroundBox.addEventListener('click', () => {
    if(profileManagementBox.style.display == 'flex' && backgroundBox.style.display == 'block'){
        profileManagementBox.style.display = 'none'
        backgroundBox.style.display = 'none'
    }
})

btnCloseEdit.addEventListener('click', () => {
    if(profileManagementBox.style.display == 'flex' && backgroundBox.style.display == 'block'){
        profileManagementBox.style.display = 'none'
        backgroundBox.style.display = 'none'
    }
})

btnChange.addEventListener('click',async () => {
    let form = new FormData()
    form.append('username',inputEditUsername.value )
    form.append('file', inputEditFile.files[0])
const res =await fetch(url + '/users', {
    method: 'PUT',
    headers: {
        token
    },
    body : form
})
const info = await res.json()
location.reload()
})

btnAddGroup.addEventListener('click', () => {
if(groupBoxCreate.style.display == 'none' && backgroundBox.style.display == 'none'){
    backgroundBox.style.display = 'block'
    groupBoxCreate.style.display = 'flex'
}
})
btnCloseGroup.addEventListener('click', () => {
    backgroundBox.style.display = 'none'
    groupBoxCreate.style.display = 'none' 
})


btnBackToUsers.addEventListener('click', () => {
        boxUsers.style.display = 'block'
        chatBox.style.display = 'none'
        profileBoxUser.style.display = 'none'
})


btnCreateGroup.addEventListener("click", async () => {
    try{
        let newGroupFormdata = new FormData()
        let randomCount = Math.floor(Math.random() * 9000 + 1000)
if(inputNewGroupAvatar.files[0] && inputNewGroupName.value.length > 2){    
    newGroupFormdata.append('file',inputNewGroupAvatar.files[0])
    newGroupFormdata.append('name',inputNewGroupName.value)
    newGroupFormdata.append('count',randomCount)
const sendData = await fetch(url + '/file', {
    method: 'POST',
    headers: {
        token
    },
    body: newGroupFormdata
})
const groupResponse = await sendData.json()
if(groupResponse.status == 200){
let type = inputNewGroupAvatar.files[0].name.split('.')
socket.emit('newGroup',{imgLink: '/message-images/' + type[0] + token + randomCount + '.' + type[type.length - 1], group_name: inputNewGroupName.value})
if( backgroundBox.style.display == 'block' && groupBoxCreate.style.display == 'flex'){
    groupBoxCreate.style.display = 'none' 
    backgroundBox.style.display  = 'none'
}
}
else throw new Error("expired token")
}
else{
throw new Error('Please complete the requirements')
}}
catch(err){
    alert(err.message)
}
})