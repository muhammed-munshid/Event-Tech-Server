import jwt from 'jsonwebtoken';

export default async(req,res,next)=>{

    try {
        // got error here
        const token= req.headers["authorization"].split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            console.log('error',err);
            return res.status(401).send({
                message: "Auth Failed",
                noToken:true
            })
        }else{
            req.body.managerId=decoded.id;
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