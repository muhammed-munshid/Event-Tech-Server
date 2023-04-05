import jwt from 'jsonwebtoken';

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

export const approvalManager = async (req, res) => {
    try {
        const approval = req.body.approval
        console.log(approval);
        const managerId = req.query.managerId
        console.log(managerId);
        if (approval) {
            await managerModel.findOneAndUpdate({ _id: managerId }, {
                $set: {
                    approval: !approval
                }
            })
            res.status(200).send({rejected:true, message:'approval rejected'})
        } else {     
            await managerModel.findOneAndUpdate({ _id: managerId }, {
                $set: {
                    approval: true
                }
            })
            res.status(200).send({success:true, message:'approval success'})
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}