const express = require("express");
const router = express.Router();
const User = require("../models/user");
const sequelize = require("../database");
const jwt = require("jsonwebtoken");

router.post('/login', (req, res) => {
    try {
        const { password, name } = req.body;
        debugger
        User.findOne({
            where: {
                name: name,
            }
        }).then(user => {
            if (!user) {
                return res.status(400).send("No Such User Found!")
            }
            else {
                if (user.password !== password) {
                    return res.status(400).send("Incorrect Password!")
                }
            }
            const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET_KEY, {
                expiresIn: "24h"
            })
            res.status(200).send({ token })
        }).catch((error) => {
            res.status(400).send('Authentication Error : ' + error);
        })
    } catch (error) {
        res.status(400).send('Authentication Error : ' + error);
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

module.exports = router;