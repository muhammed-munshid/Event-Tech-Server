import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const serviceSchema = new mongoose.Schema({
    manager_id: {
        type: Objectid,
        ref:'managers'
    },
    catering_name: {
        type: String
    },
    catering_status: {
        type: Boolean,
        default: false
    },
    user_catering_status: {
        type: Boolean,
        default: false
    },
    stage_name: {
        type: String
    },
    stage_status: {
        type: Boolean,
        default: false
    },
    user_stage_status: {
        type: Boolean,
        default: false
    },
    decoration_name: {
        type: String
    },
    decoration_status: {
        type: Boolean,
        default: false
    },
    user_decoration_status: {
        type: Boolean,
        default: false
    },
    photography_name: {
        type: String
    },
    photography_status: {
        type: Boolean,
        default: false
    },
    user_photography_status: {
        type: Boolean,
        default: false
    },
    vehicle_name: {
        type: String
    },
    vehicle_status: {
        type: Boolean,
        default: false
    },
    user_vehicle_status: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
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
        stage_id: {
            type: Objectid
        },
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
        decoration_id: {
            type: Objectid
        },
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
        photography_id: {
            type: Objectid
        },
        category_name: {
            type: Array
        },
        recent_photos: {
            type: Array
        },
        shop_name: {
            type: String
        },
        mobile_number: {
            type: Number
        },
        address: {
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
        vehicle_id: {
            type: Objectid
        },
        category_name: {
            type: Array
        },
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