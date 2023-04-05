import twilio from 'twilio'
import bcrypt from 'bcrypt'
import managerModel from '../models/managerModel.js';
import jwt from 'jsonwebtoken';

let otpCode = Math.floor(100000 + Math.random() * 900000);
let Name;
let Email;
let Mobile;
let Password;

let forgetMobile;

export const signUp = async (req, res) => {
    try {
        let managerData = req.body
        const { name, email, mobile, password } = req.body
        Name = name
        Email = email
        Mobile = mobile
        Password = password
        managerModel.findOne({ email: managerData.email }).then((user) => {
            if (user) {
                res.status(200).send({ exist: true, message: 'You are already signed' })
            } else {
                const accountSid = "AC8d467a2f7eafcfbf1c4d2adb93b59719";
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                const client = new twilio(accountSid, authToken)
                const mobile = '+91' + managerData.mobile
                const toPhoneNumber = mobile
                client.messages
                    .create({
                        to: toPhoneNumber,
                        from: '+15854605014',
                        body: `Your OTP code is ${otpCode}`,
                    })
                    .then((message) => {
                        console.log(message.sid)
                        // response.status = true
                        res.status(200).send({ success: true })
                    })
                    .catch((error) => console.log(error));
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }

}

export const signUpWithOtp = async (req, res) => {
    try {
        let otpNumber = req.body.otp
        if (otpCode == otpNumber) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(Password, salt)
            Password = hashedPassword
            const newManager = new managerModel({
                name: Name,
                email: Email,
                mobile: Mobile,
                password: Password
            })
            console.log(newManager);
            await newManager.save()
            res.status(200).send({ success: true, message: 'Your request is sending to admin, After approval of admin, you can login. otherwise you cannot login' })
        } else {
            console.log('error');
            res.status(500).send({ error: true })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }
}

export const forgetPassword = async (req, res) => {
    try {
        forgetMobile = req.body.mobile
        managerModel.findOne({ mobile: forgetMobile }).then((user) => {
            if (user) {
                const accountSid = "AC8d467a2f7eafcfbf1c4d2adb93b59719";
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                const client = new twilio(accountSid, authToken)
                const mobile = '+91' + forgetMobile
                const toPhoneNumber = mobile
                client.messages
                    .create({
                        to: toPhoneNumber,
                        from: '+15854605014',
                        body: `Your OTP code is ${otpCode}`,
                    })
                    .then((message) => {
                        console.log(message.sid)
                        res.status(200).send({ success: true })
                    })
                    .catch((error) => console.log(error));
            } else {
                res.status(200).send({ noacc: true, message: 'You are not registered in this account' })
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }

}

export const resetOtp = async (req, res) => {
    try {
        let otpNumber = req.body.otp
        if (otpCode == otpNumber) {
            res.status(200).send({ success: true, message: 'Your new password enter here...' })
        } else {
            console.log('error');
            res.status(500).send({ error: true })
        }
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
                $push: {
                    password: Password
                }
            }).then(() => {
                res.status(200).send({ success: true, message: 'Your reset password successfully' })
            })
        } else {
            res.status(500).send({ message: 'Your password is not matched' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }
}

export const Login = async (req, res) => {
    try {
        const manager = await managerModel.findOne({ email: req.body.email })
        const isMatch = await bcrypt.compare(req.body.password, manager.password)
        if (manager.approval) {
            // here it is comparing the user.password which is the encrypted password because in db it is encrypted  and req.body.password is normal password
            if (!isMatch) {
                res.status(200).send({ message: "Incorrect Password", success: false })
            } else {
                const token = jwt.sign({ id: manager._id }, process.env.JWT_SECRET, {
                    expiresIn: '1d'
                }) //the jwt.sign() will generate the token,the expiresIn is for destory the session
                res.status(200).send({ message: "Login Successfull", success: true, data: token })
            }
        } else {
            res.status(200).send({ message: 'You have not get approval from admin', approval: true })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const getUserId = async (req, res) => {
    try {
        const manager = await managerModel.findOne({ _id: req.body.managerId })
        manager.password = undefined
        if (!manager) {
            res.status(200).send({ message: "User does not exist", success: false })
        } else {
            res.status(200).send({ success: true, data: manager })
        }
    } catch (error) {
        res.status(500).send({ message: "Error getting user info", success: false, error })
    }
}

