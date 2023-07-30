const express = require("express");
const router= express.Router();
const sequelize = require("../database");
const Pricing = require("../models/pricing");
const PricingItem = require("../models/pricing_item");
const Customer = require("../models/customer");
const Product = require("../models/product");

router.get("/create",async(req,res)=>{
        try {
            const {id,customer_id,gatepass_no,reference,total}=req.body;
            sequelize.sync().then(() => {
                Pricing.create({
                    id: id,
                    customerId: customer_id,
                    gatepass_no: gatepass_no,
                    reference: reference,
                    total:total
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
  
            Pricing.destroy({
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
  
            Pricing.findAll({
                include:[{
                    model:Customer,
                    attributes:["id","name","catagory","reference","phone","address"]
                },{
                    model:PricingItem,
                    attributes:["id","unit_price","qty","discount","total"],
                    include:[{
                        model:Product,
                        attributes:["name","godown","company","thickness","size","code","price","delivery_cost","additional_cost"]
                    }]
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
  
            Pricing.findOne({
                where:prompt,
                include:[
                    {
                     model:Customer,
                    attributes:["id","name","catagory","reference","phone","address"]
                    },
                    {
                        model:PricingItem,
                        attributes:["id","unit_price","qty","discount","total"],
                        include:[{
                            model:Product,
                            attributes:["name","godown","company","thickness","size","code","price","delivery_cost","additional_cost"]
                        }]
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
  
            Pricing.update(prompt,{
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

