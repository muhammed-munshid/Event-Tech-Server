import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

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

export const resend = async (req,res)=>{
    try {
        res.status(200).send({success:true, data:Mobile, message: 'Otp sended successfully'})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false})
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