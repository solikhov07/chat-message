const jwt = require('jsonwebtoken')
const config = require('config')
module.exports = {
    SIGN: payload => {
        return jwt.sign({id: payload}, config.get("secret_key"),{expiresIn: '3d'})
    },
    VERIFY: (token) => {
        try {
            if(jwt.verify(token, config.get('secret_key')) instanceof Error) throw new Error("Expired token")
        else return jwt.verify(token, config.get('secret_key')) 
        } catch (err) {
            return err.message
        }
    }
}
