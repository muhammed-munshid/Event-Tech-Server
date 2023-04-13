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
    form:{
        eventForm : [{
            formName:{
                type:String,
                required:true
            },
            formEmail:{
                type:String,
                required:true
            },
            formMobile:{
                type:Number,
                required:true
            },
            company: {
                type:String,
                required: true
            },
            date:{
                type:Date,
                required:true
            },
            time:{
                type:String,
                required:true
            },
            count:{
                type:Number,
                required:true
            },
            type:{
                type:String,
                required:true
            },
            pin:{
                type:Number,
                required:true
            },
            place:{
                type:String,
                required:true
            }
        }]
    }
})


const userModel = mongoose.model('users',userSchema)
export default userModel