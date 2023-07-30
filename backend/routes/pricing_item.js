const express = require("express");
const router= express.Router();
const sequelize = require("../database");
const PricingItem = require("../models/pricing_item");
const Product = require("../models/product");

router.get("/create",async(req,res)=>{
        try {
            const {unit_price,qty,discount,total,pricing_id,product_id}=req.body;
            sequelize.sync().then(() => {
                PricingItem.create({
                    unit_price: unit_price,
                    qty: qty,
                    discount: discount,
                    total:total,
                    pricingId:pricing_id,
                    productId:product_id
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

router.get('/delete', async(req, res) => {
    try {
        const {id}=req.body;
        sequelize.sync().then(() => {
  
            PricingItem.destroy({
                where: {
                  id: JSON.parse(id)
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
  
            PricingItem.findAll({
                include:[{
                    model:Product,
                    attributes:["name","godown","company","thickness","size","code","price","delivery_cost","additional_cost"]
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
  
            PricingItem.findOne({
                where:prompt,
                include:[
                    {
                     model:Product,
                     attributes:["name","godown","company","thickness","size","code","price","delivery_cost","additional_cost"]
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
  
router.get('/update', async(req, res) => {
    try {
        const {id,prompt}=req.body;
        sequelize.sync().then(() => {
  
            PricingItem.update(prompt,{
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

