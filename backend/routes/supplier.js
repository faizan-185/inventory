const express = require("express");
const router= express.Router();
const sequelize = require("../database");
const Supplier = require("../models/supplier")

router.get("/create",async(req,res)=>{
        try {
            const {name,category,company,phone,address}=req.body;
            sequelize.sync().then(() => {
                Supplier.create({
                    name: name,
                    category: category,
                    company: company,
                    phone: phone,
                    address:address
                }).then(resp => {
                  res.status(200).send(resp);
              }).catch ((error)=> {
                res.status(500).send('Failed to create a new record : ' + error);
            })
            });
        } catch (error) {
            res.send('Failed to create a new record : ' + error.message);
        }
        
})

router.delete('/delete', async(req, res) => {
    try {
        const { ids }=req.body;
        sequelize.sync().then(() => {
  
            Supplier.destroy({
                where: {
                  id: ids
                }
            }).then(() => {
                res.send("Successfully deleted record.")
            }).catch ((error)=> {
                res.status(500).send('Failed to delete record : ' + error);
            })
        })
    } catch (error) {
        res.status(500).send('Failed to delete record : ' + error);
    }
    
  });

router.get('/showAll', async(req, res) => {
    try {
        sequelize.sync().then(() => {
  
            Supplier.findAll().then(resp => {
               res.send(resp);
            }).catch ((error)=> {
                res.status(500).send('Failed to retrieve data : ' + error);
            })
        })
    } catch (error) {
        res.status(500).send('Failed to retrieve data : ' + error);
    }
    
   
  
  });
router.get('/show', async(req, res) => {
    try {
            const {prompt} = req.body
        sequelize.sync().then(() => {
  
            Supplier.findOne({
                where:prompt
            }).then(resp => {
               res.send(resp)
            
            }).catch ((error)=> {
                res.status(500).send('Failed to retrieve data : ' + error);
            })
        })
    } catch (error) {
        res.status(500).send('Failed to retrieve data : ' + error);
    }
  
  });
  
router.patch('/update/:id', async(req, res) => {
    try {
        const id = req.params.id
        const { prompt }=req.body;
        sequelize.sync().then(() => {
  
            Supplier.update(prompt,{
                where: {
                  id: JSON.parse(id)
                }
            }).then(() => {
                res.status(200).send("Updated Successfully!")
            }).catch ((error)=>{
                res.status(500).send('Failed to update record : ' + error);
            })
        })
    } catch (error) {
        res.status(500).send('Failed to update record : ' + error);
    }
    
  });
module.exports=router;

