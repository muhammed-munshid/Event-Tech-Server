const mongoose = require('mongoose')

const managerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
})


const managerModel = mongoose.model('users',managerSchema)
module.exports=managerModel