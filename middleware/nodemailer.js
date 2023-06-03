const nodemailer = require('nodemailer')

module.exports  = { 
    EMAIL: async (email) => {
    try {
        const sender = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: "akbarsolikhov777@gmail.com",
                pass: "yktxvjmewvkuhnxb"
            }
        })
        
        const option = {
            from: 'akbarsolikhov777@gmail.com',
            to: email,
            subject: 'SUCCESSFUL SIGN UP',
            html : `
            <div style='display: flex;'><h3>Congratulations</h3> <i>we are glad to see you with us</i></div>
            <h3 style='color: orange ;'>WARNING!</h3>
            <b>You should login every three days</b>
            `
        }  
 sender.sendMail(option, function(err){
    if(err) return err
})
    } catch (err) {
        return err
    } }}