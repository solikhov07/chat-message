const { Types, Schema, model } = require('mongoose')

const UserModel = new Schema({
username: {
type: String,
maxLength: [30, 'username must not be long'],
trim: true,
required: true,
set: value => {
    return value.charAt(0).toUpperCase() + value.slice(1)
}
    },
    gender: {
        type: String,
        enum : {
            values: ['male', 'female'],
            message: 'Please be natural'
        }
    },
    imgLink: {
        type: String,
        maxLength: 70
    },
    email: {
        type: String,
        maxLength: [36, 'The email must not be long'],
        unique: true,
        required: true
    },
    password: {
        type: String,
        maxLength: [70, 'The password is too long'],
        required: true
    },
    active: {
        type: Boolean,
        default: false,
      },
      active_id: {
        type: String
      }
},{
    versionKey: false
})

module.exports = model('users', UserModel)