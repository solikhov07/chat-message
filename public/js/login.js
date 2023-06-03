const form = document.querySelector(".form-login")
const inputEmail = document.querySelector('.input-email')
const inputPassword = document.querySelector('.input-password')
const btnShowPass = document.querySelector(".show-password")
btnShowPass.addEventListener('click', e => {
if(inputPassword.hasAttribute("type", "password")) inputPassword.removeAttribute("type", "password")
else inputPassword.setAttribute("type", "password")
})

form.addEventListener("submit", async e => {
    e.preventDefault()
    const response = await fetch("http://localhost:5000/users/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: inputEmail.value,
            password: inputPassword.value
        })
    })
    const data = await response.json()
if(data.status == 200){
    window.location = data.route
    localStorage.setItem('token', data.token)
}
})