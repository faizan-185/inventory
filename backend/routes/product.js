const express = require("express");
const router= express.Router();
const sequelize = require("../database");
const Product = require("../models/product");
const Supplier = require("../models/supplier");

router.post("/create",async(req,res)=>{
        try {
            const {name,supplier_id,godown,company,thickness,size,code,qty,price,deliveryCost,additionalCost}=req.body;
            sequelize.sync().then(() => {
                Product.create({
                    name: name,
                    supplierId: supplier_id,
                    godown: godown,
                    company: company,
                    thickness:thickness,
                    size:size,
                    code:code,
                    qty: qty,
                    price:price,
                    deliveryCost:deliveryCost,
                    additionalCost:additionalCost
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
  
            Product.destroy({
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
  
            Product.findAll({
                include:[{
                    model:Supplier,
                    attributes:["id","name","category","company","phone","address"]
                }

                ]
            }).then(resp => {
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
  
            Product.findOne({
                where:prompt,
                include:[
                    {
                     model:Supplier,
                    attributes:["id","name","category","company","phone","address"]
                    }
                ]
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
        const id = req.params.id;
        const { prompt }=req.body;
        sequelize.sync().then(() => {
  
            Product.update(prompt,{
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

