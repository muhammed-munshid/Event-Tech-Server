import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library'
import userModel from "../models/userModel.js";
import formModel from '../models/formModel.js';
import managerModel from '../models/managerModel.js';
import serviceModel from '../models/serviceModel.js';
import Razorpay from 'razorpay'
import crypto from 'crypto'
import cartModel from '../models/cartModel.js';

let Name;
let Email;
let Mobile;
let Password;

let forgetMobile;

export const userSignUp = async (req, res) => {
    try {
        let userData = req.body
        const { name, email, mobile, password } = req.body
        Name = name
        Email = email
        Mobile = mobile
        Password = password
        userModel.findOne({ email: userData.email }).then((user) => {
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

export const resend = async (req, res) => {
    try {
        res.status(200).send({ success: true, data: Mobile, message: 'Otp sended successfully' })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false })
    }
}

export const Otp = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(Password, salt)
        Password = hashedPassword
        const newUser = new userModel({
            name: Name,
            email: Email,
            mobile: Mobile,
            password: Password
        })
        await newUser.save()
        res.status(200).send({ success: true, message: 'Your signUp verificatoin successfully' })
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false })
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email: email })
        if (user) {
            const isMatchPswrd = await bcrypt.compare(password, user.password)
            if (user.block) {
                res.status(200).send({ message: 'Admin blocked your account', block: true })
            } else {
                if (!isMatchPswrd) {
                    res.status(200).send({ message: "Incorrect Password", noUser: false })
                } else {
                    // eslint-disable-next-line no-undef
                    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                        expiresIn: '1m'
                    }) //the jwt.sign() will generate the token,the expiresIn is for destory the session
                    res.status(200).send({ message: "Login Successfull", success: true, data: token })
                }
            }
        } else {
            res.status(200).send({ message: "Incorrect Email or Password", noUser: true })
        }
    } catch (error) {
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}


export const loginGoogle = async (req, res) => {
    console.log('Hello');
    try {
        const googleToken = req.params.id
        // eslint-disable-next-line no-undef
        const client = new OAuth2Client(process.env.CLIENT_ID)
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            // eslint-disable-next-line no-undef
            audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userdetails = {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        }

        const user = await userModel.findOne({ email: userdetails.email });
        if (user) {
            let token = jwt.sign({
                _id: user._id,
            // eslint-disable-next-line no-undef
            });
            res.send({ message: "Login Successfull", success: true, data: token })
        } else {
            res.send({ message: `There is no account registered with the email id ${userdetails.email}`, noAcc: true })
        }
    } catch (error) {
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const userData = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        user.password = undefined
        if (!user) {
            return res
                .status(200)
                .send({ message: "User does not exist", success: false })
        } else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error getting user info", success: false, error })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        forgetMobile = req.body.mobile
        userModel.findOne({ mobile: forgetMobile }).then((user) => {
            if (user) {
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

export const userResetPassword = async (req, res) => {
    try {
        let Password = req.body.password
        let confirmPassword = req.body.confirmPassword
        if (Password === confirmPassword) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(Password, salt)
            Password = hashedPassword
            userModel.findOneAndUpdate({ mobile: forgetMobile }, {
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

export const eventForm = async (req, res) => {
    try {
        const userId = req.body.userId
        const orderId = req.params.id
        const userData = req.body
        const { name, email, mobile, address, date, time, count, type, pin, state, district, place, grandTotal } = userData
        const formDate = new Date(date);
        const items = await cartModel.findOne({ user_id: userId })
        const formExist = await formModel.findOne({ user_id: userId })
        if (formExist) {
            await formModel.findOneAndUpdate({ user_id: userId }, {
                $push: {
                    form: [{
                        order_id: orderId,
                        formName: name,
                        formEmail: email,
                        formMobile: mobile,
                        address: address,
                        pin: pin,
                        state: state,
                        district: district,
                        place: place,
                        totalPrice: grandTotal,
                        event_date: formDate,
                        date: new Date(),
                        time: time,
                        count: count,
                        type: type,
                        items: items,
                        status: 'failed'
                    }]
                }
            }).then(() => {
                res.status(200).send({ success: true, message: 'success' })
            })
        } else {
            const newForm = new formModel({
                user_id: userId,
                form: [{
                    order_id: orderId,
                    formName: name,
                    formEmail: email,
                    formMobile: mobile,
                    address: address,
                    pin: pin,
                    state: state,
                    district: district,
                    place: place,
                    totalPrice: grandTotal,
                    event_date: formDate,
                    date: new Date(),
                    time: time,
                    count: count,
                    type: type,
                    items: items,
                    status: 'failed'
                }]
            })
            newForm.save()
            res.status(200).send({ success: true, message: 'success' })
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }
}

export const companyList = async (req, res) => {
    try {
        const limit = req.query.limit || 10; // default limit is 10
        const page = req.query.page || 1; // default page is 1
        const offset = (page - 1) * limit;
        const totalPages = 5
        const managerList = await managerModel.find({ approval: true }).skip(offset).limit(limit);
        const allData = { totalPages, managerList }
        res.status(200).send({ data: allData })
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }
}

export const companyDetails = async (req, res) => {
    try {
        const managerId = req.params.id
        const manager = await managerModel.findOne({ _id: managerId })
        res.status(200).send({ data: manager })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const filterService = async (req, res) => {
    try {
        const name = req.body.name
        if (name === 'Food Service') {
            const manager = await serviceModel.find({catering_status:true}).populate('manager_id')
            const managerIds = manager.map((item) => item.manager_id._id);
            res.status(200).json(managerIds)
        } else if (name === 'Stage Service') {
            const manager = await serviceModel.find({stage_status:true}).populate('manager_id')
            const managerIds = manager.map((item) => item.manager_id._id);
            res.status(200).json(managerIds)
        } else if (name === 'Decoration Service') {
            const manager = await serviceModel.find({decoration_status:true}).populate('manager_id')
            const managerIds = manager.map((item) => item.manager_id._id);
            res.status(200).json(managerIds)
        } else if (name === 'Photography Service') {
            const manager = await serviceModel.find({photography_status:true}).populate('manager_id')
            const managerIds = manager.map((item) => item.manager_id._id);
            res.status(200).json(managerIds)
        } else if (name === 'Vehicle Service') {
            const manager = await serviceModel.find({vehicle_status:true}).populate('manager_id')
            const managerIds = manager.map((item) => item.manager_id._id);
            res.status(200).json(managerIds)
        } 
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const filterLocation = async (req, res) => {
    try {
        const name = req.body.name
        const manager = await managerModel.find({district:name})
        res.status(200).json(manager)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const getData = async (req, res) => {
    try {
        const managerIds = req.body.managerId
        const managers = await managerModel.find({_id:managerIds})
        res.status(200).json(managers)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const serviceDetails = async (req, res) => {
    try {
        const managerId = req.params.id
        const services = await serviceModel.findOne({ manager_id: managerId })
        res.status(200).send({ data: services })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const serviceDatas = async (req, res) => {
    try {
        const managerId = req.params.id
        const serviceList = await serviceModel.findOne({ manager_id: managerId })
        res.status(200).send({ success: true, data: serviceList })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const selectService = async (req, res) => {
    try {
        const managerId = req.params.id
        const { foodChecked, stageChecked, decorateChecked, photographyChecked, vehicleChecked } = req.body
        await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
            $set: {
                user_catering_status: foodChecked,
                user_stage_status: stageChecked,
                user_decoration_status: decorateChecked,
                user_photography_status: photographyChecked,
                user_vehicle_status: vehicleChecked
            }
        })
        res.status(200).send({ success: true })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const cartList = async (req, res) => {
    try {
        const userId = req.body.userId
        const cart = []
        let z = 0
        for (let i = 0; i < req.body.datas1.length; i++) {
            cart[z] = req.body.datas1[i]
            z++
        }
        for (let i = 0; i < req.body.datas2.length; i++) {
            cart[z] = req.body.datas2[i]
            z++
        }
        for (let i = 0; i < req.body.datas3.length; i++) {
            cart[z] = req.body.datas3[i]
            z++
        }
        for (let i = 0; i < req.body.datas4.length; i++) {
            cart[z] = req.body.datas4[i]
            z++
        }
        for (let i = 0; i < req.body.datas5.length; i++) {
            cart[z] = req.body.datas5[i]
            z++
        }
        for (let i = 0; i < req.body.datas6.length; i++) {
            cart[z] = req.body.datas6[i]
            z++
        }
        for (let i = 0; i < req.body.datas7.length; i++) {
            cart[z] = req.body.datas7[i]
            z++
        }
        for (let i = 0; i < req.body.datas8.length; i++) {
            cart[z] = req.body.datas8[i]
            z++
        }
        if (cart.length != 0) {
            const carts = new cartModel({
                user_id: userId,
                categories: cart
            })
            carts.save()
        }
        res.status(200).send({ success: true })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const orders = (req, res) => {
    try {
        // eslint-disable-next-line no-undef
        let instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
        const amount = parseInt(req.body.amount)
        let options = {
            amount: amount * 100,
            currency: "INR"
        }
        instance.orders.create(options, (err, order) => {
            if (err) {
                return res.send({ code: 500, message: 'Server Error' })
            }
            return res.send({ code: 200, message: 'order created', data: order })
        })
    } catch (error) {
        console.log(error);
    }
}

export const verify = async (req, res) => {
    const userId = req.body.userId
    const orderId = req.body.response.razorpay_order_id
    const newStatus = 'Success';
    const failedStatus = 'Failed';
    const body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id
    // eslint-disable-next-line no-undef
    const expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET).update(body.toString()).digest('hex')
    if (expectedSignature === req.body.response.razorpay_signature) {
        const datas = formModel.findOne({user_id:userId})
        const foundData = await datas.exec();
        if (foundData) {
            const formData = foundData.form;
            for (const form of formData) {
              if (form.order_id === orderId) {
                form.status = newStatus;
                break;
              }
            }
            await foundData.save();
            console.log('Order updated successfully');
          } else {
            console.log('Data not found');
          }
        res.status(200).send({ status: true, message: 'Sign Valid' })
    } else {
        const datas = formModel.findOne({user_id:userId})
        const foundData = await datas.exec();
        if (foundData) {
            const formData = foundData.form;
            for (const form of formData) {
              if (form.order_id === orderId) {
                form.status = failedStatus;
                break;
              }
            }
            await foundData.save();
            console.log('Order updated successfully');
          } else {
            console.log('Data not found');
          }
        res.status(200).send({ status: false, message: 'Sign InValid' })
    }
}

export const removeCartItem = async (req, res) => {
    const managerId = req.params.id
    // const itemId = req.body
    await serviceModel.findOneAndUpdate({ manager_id: managerId }, {
        cateringMenu: [{
            $set: {

            }
        }]
    })
    res.status(200).send({ status: true, message: 'Wait..' })
}

export const bookings = async (req, res) => {
    try {
        const userId = req.body.userId
        const forms = await formModel.findOne({user_id:userId})
        const form = forms.form
        console.log(form);
        res.status(200).json(form)
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const bookingDetails = async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.body.userId
        const forms = await formModel.findOne({ user_id: userId })
        const form = forms.form
        form.forEach(elements => {
            if (elements._id == id) {
                res.status(200).json(elements)
            }
        });
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}


export const addProfile = async (req, res) => {
    try {
        const userId = req.body.userId
        const details = req.body
        const { name, email, mobile } = details.otherData
        const { imageUpload } = details.imageData
        await userModel.findOneAndUpdate({ _id: userId }, {
            $set: {
                name: name,
                email: email,
                mobile: mobile,
                profile_image: imageUpload
            }
        })
        res.status(200).send({ success: true, message: 'Profile updated' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const profileDetails = async (req, res) => {
    try {
        const userId = req.body.userId
        const user = await userModel.findOne({ _id: userId })
        res.status(200).send({ data: user })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}