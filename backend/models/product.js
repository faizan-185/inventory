const { DataTypes } = require('sequelize');
const Supplier=require("./supplier");
const sequel =require("../database.js");

const Product = sequel.define("product", {
   id: {
     type: DataTypes.INTEGER,
     autoIncrement: true,
     primaryKey: true
   },
   name: {
     type: DataTypes.STRING,
   },
   godown: {
     type: DataTypes.STRING,
   },
   company: {
    type: DataTypes.STRING,
  },
  thickness: {
    type: DataTypes.STRING,
  },
  size:{
    type:DataTypes.STRING,
  },
  code:{
    type:DataTypes.STRING,
  },
  price:{
    type:DataTypes.FLOAT,
  },
  delivery_cost:{
    type:DataTypes.FLOAT,
  },
  additional_cost:{
    type:DataTypes.FLOAT,
  }

});
// Create relation between Supplier and the product (you will get a supplierId colum in products colum list):

Supplier.hasMany(Product);

Product.belongsTo(Supplier,{
  targetKey: "id",
})

sequel.sync().then(() => {
   console.log('Product table created successfully!');
}).catch((error) => {
   console.error('Unable to create table : ', error);
});

module.exports= Product;