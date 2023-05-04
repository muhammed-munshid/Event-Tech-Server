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
    photography_name: {
        type: String
    },
    vehicle_name: {
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
    photographyMenu: [{
        recent_photos: {
            type: Array
        },
        shop_name: {
            type: String
        },
        mobile_number: {
            type: Number
        },
        address : {
            type: String
        },
        budget: {
            type: Number
        },
        status: {
            type: Boolean,
            default: false
        }
    }],
    luxuryVehicleMenu: [{
        vehicle_image: {
            type: Array
        },
        owner_name: {
            type: String
        },
        mobile_number: {
            type: Number
        },
        rent_price: {
            type: Number
        },
        status: {
            type: Boolean,
            default: false
        }
    }]
})


const serviceModel = mongoose.model('services', serviceSchema)
export default serviceModel