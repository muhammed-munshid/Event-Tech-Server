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
    approval:{
        type:Boolean,
        default:false
    }
})


const managerModel = mongoose.model('managers',managerSchema)
module.exports=managerModel