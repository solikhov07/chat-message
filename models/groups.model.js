const Groups = require('../schemas/groupsSchema.js')


class Methods {
    async find(id, filter = {}, options = {}){
        if(id) return await Groups.findById(id, options)
        else return await Groups.find(filter, options)
    }
    async post(data){
        return await Groups.create(data)
    }
    async update(id, filter = {},data){
    if(id) return await Groups.findByIdAndUpdate(id, data) 
    else return await Groups.updateOne(filter,data)
    }
    async delete(id, filter = {}){
    if(id) return await Groups.findByIdAndDelete(id)
    else return await Groups.deleteOne(filter)
    }
    }
    
    module.exports = new Methods()