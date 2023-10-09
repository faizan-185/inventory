const express = require("express");
const router = express.Router();
const User=require("../models/user");
const Login = require("../models/login");
const sequelize = require("../database");
const jwt = require("jsonwebtoken");

router.post('/login', (req, res) => {
    try {
      const {password, username} = req.body;
      User.findOne({
        where:{
            username: username,
        }
    }).then(user => {
       if(!user){
         return res.status(400).send("No Such User Found!")
      }
      else {
          if(user.password!==password) {
              return res.status(400).send("Incorrect Password!")
          }
      }
      if (user.role === 'worker') {
        Login.findOne({
          where: {
            user_id: user.id,
            status: true
          }
        }).then(login => {
          const expirationTimeInSeconds = (login.expiration_hours * 60 * 60) + (login.expiration_minutes * 60);
          const token = jwt.sign(user.toJSON(),process.env.JWT_SECRET_KEY,{
            expiresIn: expirationTimeInSeconds
          })
          login.destroy().then(() => {
            console.log('Login deleted successfully');
          }).catch((error) => {
            console.error('Failed to delete login: ', error);
          });
          res.status(200).send({token, user})
        }).catch(err => {
          res.status(401).send('Authentication Error : ' + error);
        })
      } else{
        const token = jwt.sign(user.toJSON(),process.env.JWT_SECRET_KEY,{
          expiresIn: "24h"
        })
        res.status(200).send({token, user})
      }

    }).catch ((error)=> {
        res.status(401).send('Authentication Error : ' + error);
    })
    } catch (error) {
        res.status(401).send('Authentication Error : ' + error);
    }
});


router.post("/change_password", (req, res) => {
  try {
    const { new_password } = req.body;
    User.update({
      password: new_password
    }, {
      where: {
        name: "Admin"
      }
    }).then(resp => {
      res.status(200).send("Updated Successfully")
    }).catch(err => {
      res.status(500).send('Something went Wrong : ' + err);
    })
  } catch (error) {
    res.status(500).send('Something went Wrong : ' + error);
  }

})

router.patch("/indication_date", async (req, res) => {
  try {
    const token = req.headers["token"]
    const { indication_date } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    User.update({ indication_date }, {
      where: {
        id: userId
      }
    })

    res.status(200).send("Indication dates updated successfully")

  } catch (error) {
    res.status(500).send('Something went Wrong while updating indicating home date : ' + error);
  }
})

module.exports = router;