import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const serviceSchema = new mongoose.Schema({
    manager_id: {
        type: Objectid
    },
    cateringMenu: [{
        name: {
            type:String
        },
        category_name: {
            type:Array
        },
        Starters: {
            type: String,
            // required: true
        },
        Main: {
            type: String,
            // required: true
        },
        Desserts: {
            type: String,
            // required: true
        },
        Salads: {
            type: String,
            // required: true
        },
        Status: {
            type:Boolean,
            default:false
        }
    }],
    stageMenu: [{
        name: {
            type:String
        },
        category_name: {
            type:Array
        },
        Stage_photo:{
            type:Array,
            // required:true
        },
        Stage_budget:{
            type:Number,
            // required:true
        },
        Stage_size:{
            type:String,
            // required:true
        },
        Status: {
            type:Boolean,
            default:false
        }
    }
    ],
    decorationMenu: [{
        name: {
            type:String
        },
        category_name: {
            type:Array
        },
        Decoration_photo:{
            type:Array,
            // required:true
        },
        Including_photos:{
            type:Array,
            // required:true
        },
        Decoration_budget:{
            type:Number,
            // required:true
        },
        Status: {
            type:Boolean,
            default:false
        }
    }],
    audioMenu: {
        type: String,
        // required: true
    },
    videoMenu: {
        type: String,
        // required: true
    },
})


const serviceModel = mongoose.model('services', serviceSchema)
export default serviceModel