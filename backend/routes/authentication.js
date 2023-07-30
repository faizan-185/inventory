const express=require("express");
const router=express.Router();
const User=require("../models/user");
const sequelize = require("../database");
const jwt=require("jsonwebtoken");

router.post('/login',(req,res)=>{
    try {
      const {password} = req.body;
       
      User.findOne({
        where:{
            name:"Admin"
        }
    }).then(user => {
       if(!user){
        sequelize.sync().then(() => {
            User.create({
                name:"Admin",
                password:"1234"
            }).then(resp => {
              user={
                name:"Admin",
                password:"1234"
              }
          }).catch ((error)=> {
            return res.status(500).send('No record created: ' + error);
        })
        });
    }
    else{
        
        if(user.password!==password){
            return res.status(400).send("Incorrect Password!")
        }
    }
      const token = jwt.sign(user.toJSON(),process.env.JWT_SECRET_KEY,{
        expiresIn:"24h"
      })
         res.send({token})
    }).catch ((error)=> {
        res.status(500).send('Authentication Error : ' + error);
    })
    } catch (error) {
        res.status(500).send('Authentication Error : ' + error);
    }
    
  });


router.post("/change_password",(req,res)=>{
    try {
        const {new_password}=req.body;
        User.update({
            password:new_password
        },{
            where:{
                name:"Admin"
            }
        }).then(resp=>{
            res.status(200).send("Updated Successfully")
        }).catch(err=>{
            res.status(500).send('Something went Wrong : ' + err);
        })
      } catch (error) {
          res.status(500).send('Something went Wrong : ' + error);
      }
      
})

module.exports=router;