import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library'
import userModel from "../models/userModel.js";
import formModel from '../models/formModel.js';
import managerModel from '../models/managerModel.js';
import { connections } from 'mongoose';
import serviceModel from '../models/serviceModel.js';
import Razorpay from 'razorpay'
import crypto from 'crypto'

let Name;
let Email;
let Mobile;
let Password;

let forgetMobile;

export const userSignUp = async (req, res) => {
    try {
        let userData = req.body
        console.log(userData);
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
                    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                        expiresIn: '1d'
                    }) //the jwt.sign() will generate the token,the expiresIn is for destory the session
                    res.status(200).send({ message: "Login Successfull", success: true, data: token })
                }
            }
        } else {
            res.status(200).send({ message: "Incorrect Email or Password", noUser: true })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}


export const loginGoogle = async (req, res) => {
    // try {
        const googleToken = req.params.id
        console.log(googleToken);
        const client = new OAuth2Client(process.env.CLIENT_ID)
        console.log(client);
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        console.log(ticket);
        const payload = ticket.getPayload();
        const managerId = payload["sub"];
        console.log(payload);
        const userdetails = {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        }

        const user = await userModel.findOne({ email: userdetails.email });
        console.log("USERSIGN");
        console.log(user);
        if (user) {
          let token = jwt.sign({
            _id: user._id,
          });
          res.send({message: "Login Successfull", success: true, data: token})
        } else {
          res.send({message: `There is no account registered with the email id ${userdetails.email}`, noAcc: true})
        }
    // } catch (error) {
    //     console.log('login', error);
    //     res.status(500).send({ message: "Error in Login", success: false, error })
    // }
}

export const userData = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.managerId })
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
        const managerId = req.body.managerId
        const userData = req.body
        const { name, email, mobile, company, date, time, count, type, pin, place } = userData
        console.log(userData)
        const formExist = await formModel.findOne({ user_id: managerId })
        if (formExist) {
            await formModel.findOneAndUpdate({ user_id: managerId }, {
                $push: {
                    form: [{
                        formName: name,
                        formEmail: email,
                        formMobile: mobile,
                        company: company,
                        date: date,
                        time: time,
                        count: count,
                        type: type,
                        pin: pin,
                        place: place
                    }]
                }
            }).then((response) => {
                console.log(response);
                res.status(200).send({ success: true, message: 'success' })
            })
        } else {
            const newForm = new formModel({
                user_id: managerId,
                form: [{
                    formName: name,
                    formEmail: email,
                    formMobile: mobile,
                    company: company,
                    date: date,
                    time: time,
                    count: count,
                    type: type,
                    pin: pin,
                    place: place
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
        const managerList = await managerModel.find({approval:true})
        console.log(managerList);
        res.status(200).send({ data: managerList })
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }
}

export const companyDetails = async (req, res) => {
    try {
        const managerId = req.params.id
        console.log(managerId);
        const manager = await managerModel.findOne({ _id: managerId })
        res.status(200).send({ data: manager })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const serviceDetails = async (req, res) => {
    try {
        const managerId = req.body.managerId
        console.log(managerId);
        const services = await serviceModel.findOne({ user_id: managerId })
        res.status(200).send({ data: services })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const serviceDatas = async (req, res) => {
    try {
        const managerId = req.params.id
        const { foodChecked, stageChecked, decorateChecked, photographyChecked, vehicleChecked } = req.body
        const serviceList = await serviceModel.findOne({ manager_id: managerId })
        console.log(serviceList)
        res.status(200).send({ success: true, data: serviceList })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const selectService = async (req, res) => {
    try {
        const managerId = req.params.id
        const { foodChecked, stageChecked, decorateChecked, photographyChecked, vehicleChecked } = req.body
        await serviceModel.findOneAndUpdate({ manager_id: managerId },{
            $set: {
                user_catering_status:foodChecked,
                user_stage_status: stageChecked,
                user_decoration_status: decorateChecked,
                user_photography_status: photographyChecked,
                user_vehicle_status: vehicleChecked
            }
        })
        res.status(200).send({ success: true })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const viewMenuList = async (req, res) => {
    try {
        const managerId = req.params.id
        console.log(managerId);
        const serviceList = await serviceModel.findOne({ manager_id: managerId })
        console.log(serviceList);
        res.status(200).send({ success: true, data: serviceList })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const orders = (req,res) => {
    let instance = new Razorpay({key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET})
    const amount = parseInt(req.body.amount)
    console.log(typeof(amount),'amount');

    let options = {
        amount: amount * 100,
        currency: "INR"
    }

    instance.orders.create(options, (err,order)=> {
        if (err) {
            return res.send({code: 500, message: 'Server Error'})
        }
        console.log(order,'order');
        return res.send({code: 200, message: 'order created', data: order})
    })
}

export const verify = (req,res) => {
    const body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id
    const expectedSignature = crypto.createHmac('sha256',process.env.KEY_SECRET).update(body.toString()).digest('hex')
    // let response = {"SignatureIsValid": "false"}
    if (expectedSignature === req.body.response.razorpay_signature) {
        // response= {"SignatureIsValid": "true"}
        res.status(200).send({status:true,message: 'Sign Valid'})
    }else {
        res.status(200).send({status:false,message: 'Sign InValid'})
    }
}

export const addProfile = async (req, res) => {
    try {
        const managerId = req.body.managerId
        console.log(managerId);
        const details = req.body
        console.log(details);
        const { name, email, mobile } = details.otherData
        const { imageUpload } = details.imageData
        await userModel.findOneAndUpdate({ _id: managerId }, {
            $set: {
                name: name,
                email: email,
                mobile: mobile,
                profile_image: imageUpload
            }
        })
        res.status(200).send({ success: true, message: 'Profile updated' })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const profileDetails = async (req, res) => {
    try {
        const managerId = req.body.managerId
        console.log(managerId);
        const user = await userModel.findOne({ _id: managerId })
        console.log("userDetails:", user)
        res.status(200).send({ data: user })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}