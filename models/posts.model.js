const posts = require("../schemas/postsSchema.js")

class Methods {
async find(id, filter = {}, options = {}){
    if(id) return await posts.findById(id, options)
    else return await posts.find(filter, options)
}
async post(data){
    return await posts.create(data)
}
async update(id, filter = {},data){
if(id) return await posts.findByIdAndUpdate(id, data) 
else return await posts.updateOne(filter,data)
}
async delete(id, filter = {}){
if(id) return await posts.findByIdAndDelete(id)
else return await posts.deleteOne(filter)
}
}

module.exports = new Methods()