const express = require('express')
const twilio = require('twilio');
const bcrypt = require('bcrypt')
const managerModel = require('../models/managerModel')
const router = express.Router()

let otpCode = Math.floor(100000 + Math.random() * 900000);
let Name;
let Email;
let Mobile;
let Password;

router.post('/signUp', async (req, res) => {
    try {
        let managerData = req.body
        console.log(managerData);
        const { name, email, mobile, password } = req.body
        Name = name
        Email = email
        Mobile = mobile
        Password = password
        managerModel.findOne({ email: managerData.email }).then((user) => {
            if (user) {
                // response.userExist = true
                res.status(200).send({ exist: true })
            } else {
                // const accountSid = "AC8d467a2f7eafcfbf1c4d2adb93b59719";
                // const authToken = process.env.TWILIO_AUTH_TOKEN;
                // const client = new twilio(accountSid, authToken)
                // const mobile = '+91' + managerData.mobile
                // const toPhoneNumber = mobile
                // client.messages
                //     .create({
                //         to: toPhoneNumber,
                //         from: '+15854605014',
                //         body: `Your OTP code is ${otpCode}`,
                //     })
                //     .then((message) => {
                //         console.log(message.sid)
                //         // response.status = true
                res.status(200).send({ success: true })
                //     })
                // .catch((error) => console.log(error));
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }

})

router.post('/otp', async (req, res) => {
    try {
        let otpNumber = req.body.otp
        // if (otpCode == otpNumber) {
        console.log(Name);
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
        // } else {
        //     console.log('error');
        //     res.status(500).send({ error: true })
        // }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: true })
    }
})

module.exports = router