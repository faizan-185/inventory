const express=require("express");
const router=express.Router();
const Pricing=require("../models/pricing");
const PricingItem=require("../models/pricing_item");
const Customer=require("../models/customer");
const Product=require("../models/product");


const sequelize = require("../database");
const jwt=require("jsonwebtoken");

router.post('/get_profit',async(req,res)=>{
    try {
      const {start_date,end_date,type} = req.body;
        let pricingvalue,PricingItemValue,ProductValue;
        const pricingList=await Pricing.findAll({
          include:[{
              model:Customer,
              attributes:["id","name","category","reference","phone","address"]
          },{
              model:PricingItem,
              attributes:["id","unit_price","qty","discount","total"],
              include:[{
                  model:Product,
                  attributes:["name","godown","company","thickness","size","code","price","delivery_cost","additional_cost"]
              }]
          }

          ]
      });
        
    } catch (error) {
        res.status(500).send('Error : ' + error);
    }
    
  });

module.exports=router;