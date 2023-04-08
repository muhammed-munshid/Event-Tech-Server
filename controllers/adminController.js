import managerModel from '../models/managerModel.js';

let Email = 'admin@gmail.com'
let Password = '12345'

export const adminLogin = async (req, res) => {
    try {
        const adminData = req.body
        const email = adminData.email
        const password = adminData.password
        if (email == Email && password == Password) {
            res.status(200).send({ message: "Login Successfull", success: true })
        } else {
            res.status(500).send({ message: "Incorrect email or password", success: false })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const notification = async (req, res) => {
    try {
        const manager = await managerModel.find()
        console.log(manager);
        res.status(200).json(manager)
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const blockManager = async (req, res) => {
    try {
        const block = req.body.block
        const managerId = req.query.managerId
        if (block) {
            await managerModel.findOneAndUpdate({ _id: managerId }, {
                $set: {
                    block: !block
                }
            })
            res.status(200).send({unBlock:true, message:'manager un blocked'})
        } else {     
            await managerModel.findOneAndUpdate({ _id: managerId }, {
                $set: {
                    block: true
                }
            })
            res.status(200).send({block:true, message:'manager blocked'})
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}