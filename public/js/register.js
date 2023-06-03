const url = 'http://10.10.2.31:5000'
const form = document.querySelector(".form-login")
const inputUsername = document.querySelector(".input-username")
const inputEmail = document.querySelector('.input-email')
const inputPassword = document.querySelector('.input-password')
const inputFile = document.querySelector(".input-file")
const selectGendre = document.querySelector(".gendre_select")
const btnShowPass = document.querySelector(".show-password")
btnShowPass.addEventListener('click', e => {
if(inputPassword.hasAttribute("type", "password")) inputPassword.removeAttribute("type", "password")
else inputPassword.setAttribute("type", "password")
})

let formData = new FormData()
form.addEventListener("submit", async e => {
    e.preventDefault()
    try{
    if(inputFile.files.length) {
formData.append('username', inputUsername.value.slice(0, 10))
formData.append('email', inputEmail.value)
formData.append('password', inputPassword.value)
formData.append("gender", selectGendre.value)
formData.append("avatar", inputFile.files[0])

const response = await fetch(url + '/users/register',{
    method: "POST",
    body: formData
})
const data = await response.json()
if(data.status == 200){
    window.location = data.route
    localStorage.setItem('token', data.token)
}
else throw new Error(data.message)
}
else{
    const response = await fetch(url + '/users/register',{
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
     username:    inputUsername.value,
email: inputEmail.value,
password: inputPassword.value,
gender: selectGendre.value
    })
})
const data = await response.json()
if(data.status == 200){
    window.location = data.route
    localStorage.setItem('token', data.token)
}
else throw new Error(data.message)
}
}
catch(err){
    alert(err.message)
}
})