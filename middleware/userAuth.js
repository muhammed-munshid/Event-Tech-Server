/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';

    export default async(req,res,next)=>{

    try {
        // got error here
        const token= req.headers["authorization"].split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            console.log(err);
            return res.status(401).send({
                message: "You have no account, Please Login",
                noToken:true
            })
        }else{
            req.body.userId=decoded.id;
            if (req.body.userId == null) {
                return res.status(200).send({
                    message: "You have no account, Please Login",
                    noAcc: true
                })
            } else {
                next();
            }
        }
    })
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            message: "Auth Failed",
            success:false
        })
    }
      
}