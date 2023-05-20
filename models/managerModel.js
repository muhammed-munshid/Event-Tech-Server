import mongoose from 'mongoose'

const managerSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    mobile:{
        type:Number
    },
    address:{
        type:String,
    },
    adhaar: {
        type:Array,
    },
    license_or_voterId: {
        type:Array,
    },
    company_name: {
        type:String,
    },
    state: {
        type:String
    },
    place: {
        type:String
    },
    pincode : {
        type:Number
    },
    district: {
        type:String
    },
    password:{
        type:String
    },
    manager_image:{
        type:Array
    },
    company_logo: {
        type:Array
    },
    description: {
        type:String
    },
    recent_work: {
        type:Array
    },
    approval:{
        type:Boolean,
        default:false
    },
    block: {
        type:Boolean,
        default:false
    }
})


const managerModel = mongoose.model('managers',managerSchema)
export default managerModel