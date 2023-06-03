const { Types, model, Schema } = require("mongoose")

const PostsModel = new Schema({
    message: {
        type: String
    },
    avatar: {
type: String,
required: true
    },
file: {
    type: String
},
    date: {
        type: String
    },
    user_id: {
        type: Types.ObjectId, 
        required: true,
        ref: 'users'
    },
    to: {
        type: Types.ObjectId,
        ref: 'users'
    },
    room:{
        type: String
    }
})

module.exports = model("posts", PostsModel)