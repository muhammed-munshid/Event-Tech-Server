import jwt from 'jsonwebtoken';

    export default async(req,res,next)=>{

    try {
        // got error here
        const token= req.headers["authorization"].split(" ")[1];
        console.log(token);
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            console.log('Helloooo');
        if(err){
            console.log(err);
            return res.status(401).send({
                message: "Auth Failed",
                success:false
            })
        }else{
            req.body.userId=decoded.id;
            // let userId = req.body.userId
            console.log(req.body.userId);
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