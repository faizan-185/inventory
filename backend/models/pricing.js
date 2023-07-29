const { DataTypes } = require('sequelize');
const Customer=require("./customer");
const sequel =require("../database.js");

const Pricing = sequel.define("pricing", {
   id: {
     type: DataTypes.STRING,
     primaryKey: true,
   },
   gatepass_no: {
     type: DataTypes.STRING,
   },
   reference: {
    type: DataTypes.STRING,
  },
  total:{
    type:DataTypes.FLOAT,
  }

});
// Create relation between Pricing and the Customer :"
Customer.hasMany(Pricing);

Pricing.belongsTo(Customer,{
    targetKey: "id",
  })

sequel.sync().then(() => {
   console.log('Pricing table created successfully!');
}).catch((error) => {
   console.error('Unable to create table : ', error);
});

module.exports= Pricing;