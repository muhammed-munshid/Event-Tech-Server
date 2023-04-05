import jwt from 'jsonwebtoken';

export default async(req,res,next)=>{

    try {
        // got error here
        const token= req.headers["authorization"].split(" ")[1];
        console.log(token);
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).send({
                message: "Auth Failed",
                success:false
            })
        }else{
            req.body.managerId=decoded.id;
            console.log(req.body.managerId);
            next();
        }
    })
    } catch (error) {
        return res.status(401).send({
            message: "Auth Failed",
            success:false
        })
    }
      
}