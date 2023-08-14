const { DataTypes } = require('sequelize');
const Pricing=require("./pricing");
const Product=require("./product");
const sequel =require("../database.js");

const PricingItem = sequel.define("pricing_item", {
   id: {
     type: DataTypes.INTEGER,
     autoIncrement:true,
     primaryKey: true,
   },
   unit_price: {
     type: DataTypes.FLOAT,
   },
   qty: {
    type: DataTypes.INTEGER,
  },
  discount: {
    type: DataTypes.FLOAT,
  },
  total:{
    type:DataTypes.FLOAT,
  }
});
// Create relation between Pricing and the Pricing Item 
Pricing.hasMany(PricingItem);

PricingItem.belongsTo(Pricing,{
    targetKey: "id",
})
// Create relation between Product and the Pricing Item
Product.hasMany(PricingItem);

PricingItem.belongsTo(Product,{
    targetKey: "id",
})

  

sequel.sync().then(() => {
   console.log('PricingItem table created successfully!');
}).catch((error) => {
   console.error('Unable to create table : ', error);
});

module.exports= PricingItem;