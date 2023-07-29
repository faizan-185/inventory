const { DataTypes } = require('sequelize');

const sequel =require("../database.js");

const Customer = sequel.define("customer", {
   id: {
     type: DataTypes.INTEGER,
     autoIncrement: true,
     primaryKey: true
   },
   name: {
     type: DataTypes.STRING,
   },
   catagory: {
    type: DataTypes.STRING,
  },
    reference: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  }

});

sequel.sync().then(() => {
   console.log('Customer table created successfully!');
}).catch((error) => {
   console.error('Unable to create table : ', error);
});

module.exports= Customer;