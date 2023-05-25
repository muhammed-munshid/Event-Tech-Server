import formModel from '../models/formModel.js';
import managerModel from '../models/managerModel.js';
import userModel from '../models/userModel.js';

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
        res.status(200).json(manager)
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const dashboard = async (req, res) => {
    try {
        const users = await userModel.find()
        const approved = await managerModel.find({approval:true})
        const managers = await managerModel.find()
        const forms = await formModel.find()
        const userLength = users.length
        const approvedLength = approved.length
        const managerLength = managers.length
        const year = new Date().getFullYear();
        const userCount = new Array(12).fill(0);
        const promises = [];
        
        for (let month = 1; month <= 12; month++){
          const start = new Date(`${year}-${month.toString().padStart(2, '0')}-01`);
          let end;
          if (month === 12) {
            end = new Date(`${year}-12-31`);
          } else {
            end = new Date(`${year}-${(month + 1).toString().padStart(2, '0')}-01`);
          }
          
          const promise = formModel.aggregate([
            {
              $unwind: "$form" // Unwind the form array
            },
            {
              $match: {
                "form.date": {
                  $gte: start,
                  $lt: end
                },
                "form.status": "Success" // Only match forms with status "Success"
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$form.totalPrice" } // Sum the totalAmount field
              }
            }
          ])          
          .then((result) => {
              if (result.length > 0) {
              userCount[month - 1] = result[0].total;
            }
          })
          .catch((error) => {
            console.log(error);
          });
          promises.push(promise);
        }
        
        Promise.all(promises)
        .then(() => {
          if(userCount.some((count) => count > 0)){
            res.status(200).json({userLength,approvedLength,managerLength,forms,userCount})
          }else{
            res.send({
              success:false,
              message:'No data found',
            })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}


export const users = async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).json(users)
    } catch (error) {
        console.log('error', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const blockUser = async (req, res) => {
    try {
        const block = req.body.block
        const userId = req.query.userId
        if (block) {
            await userModel.findOneAndUpdate({ _id: userId }, {
                $set: {
                    block: !block
                }
            })
            res.status(200).send({ unBlock: true, message: 'user un blocked' })
        } else {
            await userModel.findOneAndUpdate({ _id: userId }, {
                $set: {
                    block: true
                }
            })
            res.status(200).send({ block: true, message: 'user blocked' })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const managers = async (req, res) => {
    try {
        const manager = await managerModel.find({approval:false})
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
            res.status(200).send({ unBlock: true, message: 'manager un blocked' })
        } else {
            await managerModel.findOneAndUpdate({ _id: managerId }, {
                $set: {
                    block: true
                }
            })
            res.status(200).send({ block: true, message: 'manager blocked' })
        }
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const managerDetails = async (req, res) => {
    try {
        const managerId = req.params.id
        const manager = await managerModel.findOne({ _id: managerId })
        res.status(200).send({ data: manager })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const approvalManager = async (req, res) => {
    try {
        const managerId = req.query.managerId
        await managerModel.findOneAndUpdate({_id:managerId},{
            $set: {
                approval:true
            }
        })
        res.status(200).send({ success: true, message: 'manager approved' })
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const approvalList = async (req, res) => {
    try {
        const manager = await managerModel.find({approval:true})
        res.status(200).json(manager)
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}

export const salesReport = async (req, res) => {
    try {
        const forms = await formModel.find()
        res.status(200).json(forms)
    } catch (error) {
        console.log('login', error);
        res.status(500).send({ message: "Error in Login", success: false, error })
    }
}