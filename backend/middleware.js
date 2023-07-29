const jwt=require("jsonwebtoken");

const middleware=(req,res,next)=>{
    const token= req.headers["token"]
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
            if(err) return res.status(400).send("Authentication Error!")
            req.body.user=user
        });
        next();
    }
    else{
        res.status(400).send("No token found")
    }
    
}

module.exports=middleware;