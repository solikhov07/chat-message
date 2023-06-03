const Users = require('../schemas/usersSchema.js')

class  Methods{
async get(id, filter = {}, options = {}){
    try{
        if(id) return await Users.findById(id, options)
        else return await Users.find(filter, options)
    }catch(err){
        return err.message
    }
}
async post(data){
    try{
return await Users.create(data)
    }catch(err){
        return err.message
    }
}
async update(id,filter = {},data){
    try{
if(id) return await Users.findByIdAndUpdate(id, data)
else return await Users.updateOne(filter, data)
    }catch(err){
        return err.message
    }
}
async delete(id, filter = {}){
    try{
if(id) return await Users.findByIdAndDelete(id)
else return await Users.deleteOne(filter)
}catch(err){
        return err.message
    }
}
}

module.exports = new Methods()