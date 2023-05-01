import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const serviceSchema = new mongoose.Schema({
    manager_id: {
        type: Objectid
    },
    catering_name: {
        type: String
    },
    stage_name: {
        type: String
    },
    decoration_name: {
        type: String
    },
    audio_name: {
        type: String
    },
    video_name: {
        type: String
    },
    cateringMenu: [{
        catering_id: {
            type: Objectid
        },
        category_name: {
            type: Array
        },
        starter_name: {
            type: String,
        },
        starter_image: {    
            type: Array
        },
        starter_price: {
            type: String,
        },
        main_name: {
            type: String,
        },
        main_price: {
            type: String,
        },
        main_image: {
            type: Array
        },
        dessert_name: {
            type: String,
        },
        dessert_price: {
            type: String,
        },
        dessert_image: {
            type: Array
        },
        salad_name: {
            type: String,
        },
        salad_price: {
            type: String,
        },
        salad_image: {
            type: Array
        },
        status: {
            type: Boolean,
            default: false
        }
    }],
    stageMenu: [{
        category_name: {
            type: Array
        },
        stage_photo: {
            type: Array,
        },
        stage_budget: {
            type: Number,
        },
        stage_size: {
            type: String,
        },
        status: {
            type: Boolean,
            default: false
        }
    }],
    decorationMenu: [{
        category_name: {
            type: Array
        },
        decoration_photo: {
            type: Array,
        },
        including_photos: {
            type: Array,
        },
        decoration_budget: {
            type: Number,
        },
        status: {
            type: Boolean,
            default: false
        }
    }],
    audioMenu: [{
        category_name: {
            type: Array
        },
        things_photos: {
            type: Array
        },
        things_name: {
            type: String
        },
        status: {
            type: Boolean,
            default: false
        }
    }],
    videoMenu: [{
        category_name: {
            type: Array
        },
        things_photos: {
            type: Array
        },
        things_name: {
            type: String
        },
        status: {
            type: Boolean,
            default: false
        }
    }]
})


const serviceModel = mongoose.model('services', serviceSchema)
export default serviceModel