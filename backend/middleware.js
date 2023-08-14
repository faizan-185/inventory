const jwt=require("jsonwebtoken");

const middleware=(req,res,next)=>{
    try {
        
        const token= req.headers["token"]
        if(token){
            jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
                if(err) return res.status(401).send("Authentication Error!")
                req.body.user=user
            });
            next();
        }
        else{
            res.status(400).send("No token found")
        }
    } catch (error) {
        res.status(500).send("Something went wrong " + error);
    }
    
}

module.exports=middleware;