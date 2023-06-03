const { Types, model, Schema } = require('mongoose')

const groupsModel = new Schema({
    group_name:{
        type: String,
        unique: true
    },
    imgLink: {
        type: String
    }
})

module.exports = model('groups', groupsModel)