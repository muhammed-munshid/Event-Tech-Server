import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import managerModel from '../models/managerModel.js';
import formModel from '../models/formModel.js';
import serviceModel from '../models/serviceModel.js';

let Name;
let Email;
let Mobile;
let Company;
let Address;
let Aadhar;
let License;
let Pincode;
let State;
let District;
let Place;
let Password;

let forgetMobile;

export const signUp = async (req, res) => {
    try {
        console.log('Hii');
        const { managerData, imageData } = req.body
        console.log(imageData);
        console.log(managerData);
        const { name, email, mobile, company, address, pincode, state, district, place, password } = managerData
        Name = name
        Email = email
        Mobile = mobile
        Company = company
        Address = address
        Aadhar = imageData.imageUpload1
        License = imageData.imageUpload2
        Pincode = pincode
        State = state
        District = district
        Place = place
        Password = password

        managerModel.findOne({ email: managerData.email }).then((user) => {
            if (user) {
                res.status(200).send({ exist: true, message: 'You are already signed' })
            } else {
                res.status(200).send({ success: true, message: 'Otp sended successfully' })
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }
}

export const resendOtp = async (req, res) => {
    try {
        res.status(200).send({ success: true, data: Mobile, message: 'Otp sended successfully' })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false })
    }
}

export const signUpWithOtp = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(Password, salt)
        Password = hashedPassword
        const newManager = new managerModel({
            name: Name,
            email: Email,
            mobile: Mobile,
            company_name: Company,
            address: Address,
            pincode: Pincode,
            state: State,
            district: District,
            place: Place,
            password: Password,
            adhaar: Aadhar,
            license_or_voterId: License
        })
        await newManager.save()
        res.status(200).send({ success: true, message: 'Your request is sending to admin, After approval of admin, you can login. otherwise you cannot login' })
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false })
    }
}

export const forgetPassword = async (req, res) => {
    try {
        forgetMobile = req.body.mobile
        managerModel.findOne({ mobile: forgetMobile }).then((manager) => {
            if (manager) {
                res.status(200).send({ success: true, message: 'Otp sended successfully' });
            } else {
                res.status(200).send({ noacc: true, message: 'You are not registered in this account' })
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }
}

export const resetPassword = async (req, res) => {
    try {
        let Password = req.body.password
        let confirmPassword = req.body.confirmPassword
        if (Password === confirmPassword) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(Password, salt)
            Password = hashedPassword
            managerModel.findOneAndUpdate({ mobile: forgetMobile }, {
                $set: {
                    password: Password
                }
            }).then(() => {
                res.status(200).send({ success: true, message: 'Your reset password successfully' })
            })
        } else {
            res.status(200).send({ message: 'Your password is not matched' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body
        const manager = await managerModel.findOne({ email: email })
        console.log('manager:' + manager);
        if (manager) {
            const isMatchPswrd = await bcrypt.compare(password, manager.password)
            if (manager.approval) {
                if (manager.block) {
                    res.status(200).send({ message: 'Admin blocked your account', block: true })
                } else {
                    if (!isMatchPswrd) {
                        res.status(200).send({ message: "Incorrect Password", noUser: false })
                    } else {
                        const token = jwt.sign({ id: manager._id }, process.env.JWT_SECRET, {
                            expiresIn: '1d'
                        }) //the jwt.sign() will generate the token,the expiresIn is for destory the session
                        res.status(200).send({ message: "Login Successfull", success: true, data: token })
                    }
                }
            } else {
                res.status(200).send({ message: 'Your approval is pending...', pendApproval: true })
            }
        } else {
            res.status(200).send({ message: "Incorrect Email or Password", noUser: true })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}



export const managerData = async (req, res) => {
    try {
        const manager = await managerModel.findOne({ _id: req.body.managerId })
        console.log(manager);
        manager.password = undefined
        if (!manager) {
            return res
                .status(200)
                .send({ message: "Manager does not exist", noManager: true })
        } else {
            res.status(200).send({
                success: true, message: "Manager Data created",
                data: manager
            })
        }
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error getting user info", error: true, error })
    }
}

export const bookings = async (req, res) => {
    try {
        const form = await formModel.find()
        console.log('form'+form);
        res.status(200).json(form)
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const bookingDetails = async (req, res) => {
    try {
        // const formId = req.params.id
        const userId = req.body.user
        const bookingId = req.body.bookingId
        console.log(userId);
        const forms = await formModel.findOne({ _id: bookingId })
        console.log(forms);
        res.status(200).send({ data: forms })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const viewServices = async (req, res) => {
    try {
        const managerId = req.body.managerId
        console.log(managerId);
        const serviceList = await serviceModel.findOne({ manager_id: managerId })
        console.log(serviceList);
        res.status(200).send({ success: true, data: serviceList })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const services = async (req, res) => {
    try {
        const managerId = req.body.managerId
        const { foodChecked, stageChecked, decorateChecked, photographyChecked, vehicleChecked } = req.body
        const existService = await serviceModel.findOne({ manager_id: managerId })
        if (!existService) {
            const newService = new serviceModel({
                manager_id: managerId,
                catering_name: 'Food Service',
                catering_status: foodChecked,
                stage_name: 'Stage Service',
                stage_status: stageChecked,
                decoration_name: 'Decoration',
                decoration_status: decorateChecked,
                photography_name: 'Photography',
                photography_status: photographyChecked,
                vehicle_name: 'Luxury Vehicles',
                vehicle_status: vehicleChecked,
                cateringMenu: [{
                    category_name: ['Starters', 'Main', 'Desserts', 'Salads'],
                    status: foodChecked
                }],
                stageMenu: [{
                    category_name: ['Stage Photo', 'Stage Budget', 'Stage Size'],
                    status: stageChecked
                }],
                decorationMenu: [{
                    category_name: ['Decoration Photo', 'Including Photos', 'Decoration Budget'],
                    status: decorateChecked
                }],
                photographyMenu: [{
                    category_name: ['Recent Photography Photos', 'Shop Name', 'Mobile Number', 'Address', 'Budget'],
                    status: photographyChecked
                }],
                luxuryVehicleMenu: [{
                    category_name: ['Vehicle', 'Owner Name', 'Mobile Number', 'Rent Price'],
                    status: vehicleChecked
                }]
            })
            await newService.save()
            res.status(200).send({ success: true })
        } else {
            res.status(200).send({ exist: true, message: 'You have already added' })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const removeService = async (req, res) => {
    try {
        const managerId = req.body.managerId
        const name = req.query.name
        const serviceData = await serviceModel.findOne({ manager_id: managerId })
        if (serviceData.catering_name == name) {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $set: {
                    catering_status: false
                }
            })
            res.status(200).send({ success: true })
        } else if (serviceData.stage_name == name) {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $set: {
                    stage_status: false
                }
            })
            res.status(200).send({ success: true })
        } else if (serviceData.decoration_name == name) {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $set: {
                    decoration_status: false
                }
            })
            res.status(200).send({ success: true })
        } else if (serviceData.photography_name == name) {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $set: {
                    photography_status: false
                }
            })
            res.status(200).send({ success: true })
        } else if (serviceData.vehicle_name == name) {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $set: {
                    vehicle_status: false
                }
            })
            res.status(200).send({ success: true })
        } else {
            res.status(200).send({ error: true })
        }
    } catch (error) {
        res.status(500).send({ success: false })
    }
}

export const addCatering = async (req, res) => {
    try {
        const managerId = req.body.managerId
        const { cateringData, imageUpload1, imageUpload2, imageUpload3, imageUpload4 } = req.body
        const { starterName, starterPrice, mainName, mainPrice, dessertsName, dessertsPrice, saladsName, saladsPrice } = cateringData
        console.log('bodyyyyyyg' + starterName);
        console.log(imageUpload1);
        let exist = false
        const existCatering = await serviceModel.findOne({ manager_id: managerId })
        const array = existCatering.cateringMenu
        array.forEach(element => {
            if (element.catering_id == managerId) {
                exist = true
            } else {
                exist = false
            }
        })
        if (!exist) {
            console.log("Hellooo");
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $set: {
                    cateringMenu: [{
                        catering_id: managerId,
                        category_name: ['Starters', 'Main', 'Desserts', 'Salads'],
                        starter_name: starterName,
                        starter_price: starterPrice,
                        starter_image: imageUpload1,
                        main_name: mainName,
                        main_price: mainPrice,
                        main_image: imageUpload2,
                        dessert_name: dessertsName,
                        dessert_price: dessertsPrice,
                        dessert_image: imageUpload3,
                        salad_name: saladsName,
                        salad_price: saladsPrice,
                        salad_image: imageUpload4
                    }]
                }
            })
            res.status(200).send({ success: true })
        } else {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $push: {
                    cateringMenu: [{
                        catering_id: managerId,
                        starter_name: starterName,
                        starter_price: starterPrice,
                        starter_image: imageUpload1,
                        main_name: mainName,
                        main_price: mainPrice,
                        main_image: imageUpload2,
                        dessert_name: dessertsName,
                        dessert_price: dessertsPrice,
                        dessert_image: imageUpload3,
                        salad_name: saladsName,
                        salad_price: saladsPrice,
                        salad_image: imageUpload4
                    }]
                }
            })
            res.status(200).send({ success: true })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const addStage = async (req, res) => {
    try {
        const managerId = req.body.managerId
        const { stageDatas, imageUpload1 } = req.body
        const { stageBudget, stageSize } = stageDatas
        console.log('bodyyyyyyg' + stageBudget);
        console.log(imageUpload1);
        let exist = false
        const existStage = await serviceModel.findOne({ manager_id: managerId })
        const array = existStage.stageMenu
        array.forEach(element => {
            if (element.stage_id == managerId) {
                exist = true
            } else {
                exist = false
            }
        })
        if (!exist) {
            console.log("Hellooo");
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $set: {
                    stageMenu: [{
                        stage_id: managerId,
                        category_name: ['Stage Photo', 'Stage Budget', 'Stage Size'],
                        stage_photo: imageUpload1,
                        stage_budget: stageBudget,
                        stage_size: stageSize
                    }]
                }
            })
            res.status(200).send({ success: true })
        } else {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $push: {
                    stageMenu: [{
                        stage_id: managerId,
                        stage_photo: imageUpload1,
                        stage_budget: stageBudget,
                        stage_size: stageSize
                    }]
                }
            })
            res.status(200).send({ success: true })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const addDecorate = async (req, res) => {
    try {
        const managerId = req.body.managerId
        const { imageUpload1, imageUpload2, budget } = req.body
        console.log(imageUpload1);
        let exist = false
        const existStage = await serviceModel.findOne({ manager_id: managerId })
        const array = existStage.decorationMenu
        array.forEach(element => {
            if (element.stage_id == managerId) {
                exist = true
            } else {
                exist = false
            }
        })
        if (!exist) {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $set: {
                    decorationMenu: [{
                        decoration_id: managerId,
                        category_name: ['Decoration Photo', 'Including Photos', 'Decoration Budget'],
                        decoration_photo: imageUpload1,
                        including_photos: imageUpload2,
                        decoration_budget: budget
                    }]
                }
            })
            res.status(200).send({ success: true })
        } else {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $push: {
                    decorationMenu: [{
                        decoration_id: managerId,
                        decoration_photo: imageUpload1,
                        including_photos: imageUpload2,
                        decoration_budget: budget
                    }]
                }
            })
            res.status(200).send({ success: true })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const addPhotography = async (req, res) => {
    try {
        const managerId = req.body.managerId
        const { imageUpload1, photographyDatas } = req.body
        console.log('bodyyyyyyg' + photographyDatas);
        const {shopName, mobile,address,budgetPhoto} = photographyDatas
        console.log(imageUpload1);
        let exist = false
        const existStage = await serviceModel.findOne({ manager_id: managerId })
        const array = existStage.photographyMenu
        array.forEach(element => {
            if (element.stage_id == managerId) {
                exist = true
            } else {
                exist = false
            }
        })
        if (!exist) {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $set: {
                    photographyMenu: [{
                        photography_id: managerId,
                        category_name: ['Recent Photos', 'Shop Name', 'Mobile Number','Address','Budget'],
                        recent_photos: imageUpload1,
                        shop_name: shopName,
                        mobile_number: mobile,
                        address:address,
                        budget:budgetPhoto                        
                    }]
                }
            })
            res.status(200).send({ success: true })
        } else {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $push: {
                    photographyMenu: [{
                        photography_id: managerId,
                        recent_photos: imageUpload1,
                        shop_name: shopName,
                        mobile_number: mobile,
                        address:address,
                        budget:budgetPhoto                        
                    }]
                }
            })
            res.status(200).send({ success: true })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const addVehicle = async (req, res) => {
    try {
        const managerId = req.body.managerId
        const { imageUpload1, vehicleDatas } = req.body
        console.log('bodyyyyyyg' + vehicleDatas);
        const {owner, mobileNumber,rent} = vehicleDatas
        console.log(imageUpload1);
        let exist = false
        const existStage = await serviceModel.findOne({ manager_id: managerId })
        const array = existStage.luxuryVehicleMenu
        array.forEach(element => {
            if (element.stage_id == managerId) {
                exist = true
            } else {
                exist = false
            }
        })
        if (!exist) {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $set: {
                    luxuryVehicleMenu: [{
                        vehicle_id: managerId,
                        category_name: ['Vehicle Image', 'Owner Name', 'Mobile Number','Rent Price'],
                        vehicle_image: imageUpload1,
                        owner_name: owner,
                        mobile_number: mobileNumber,
                        rent_price:rent                    
                    }]
                }
            })
            res.status(200).send({ success: true })
        } else {
            await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
                $push: {
                    luxuryVehicleMenu: [{
                        vehicle_id: managerId,
                        vehicle_image: imageUpload1,
                        owner_name: owner,
                        mobile_number: mobileNumber,
                        rent_price:rent                          
                    }]
                }
            })
            res.status(200).send({ success: true })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}


export const managerProfile = async (req, res) => {
    try {
        const managerId = req.body.managerId
        const { name, description, imageUpload1, imageUpload2, imageUpload3 } = req.body
        const form = await managerModel.findOneAndUpdate({ _id: managerId }, {
            $set: {
                name: name,
                description: description,
                manager_image: imageUpload1,
                company_logo: imageUpload2,
                recent_work: imageUpload3,
            }
        })
        console.log(form);
        res.status(200).json(form)
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const getDetails = async (req, res) => {
    // try {
    const managerId = req.body.managerId
    const details = await managerModel.findOne({ _id: managerId })
    console.log(details);
    res.status(200).json(details)
    // } catch (error) {
    //     console.log('login', error);
    //     res.status(500).send({ message: "Error in Login", success: false, error })
    // }
}