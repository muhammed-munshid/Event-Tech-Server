import mongoose from 'mongoose'

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
    address:{
        type:String,
        // required:true
    },
    adhaar: {
        type:Array,
        // required:true
    },
    license: {
        type:Array,
        // required:true
    },
    voterId: {
        type:Array,
        // required:true
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


const managerModel = mongoose.model('managers',managerSchema)
export default managerModel