import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
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
    block:{
        type:Boolean,
        default:false
    }
})


const userModel = mongoose.model('users',userSchema)
export default userModel