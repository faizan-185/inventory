const { DataTypes } = require('sequelize');

const sequel =require("../database.js");

const Supplier = sequel.define("supplier", {
   id: {
     type: DataTypes.INTEGER,
     autoIncrement: true,
     primaryKey: true
   },
   catagory: {
     type: DataTypes.STRING,
     allowNull: false
   },
   name: {
     type: DataTypes.STRING,
   },
   phone: {
     type: DataTypes.STRING,
   },
   company: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  }

});

sequel.sync().then(() => {
   console.log('Supplier table created successfully!');
}).catch((error) => {
   console.error('Unable to create table : ', error);
});

module.exports= Supplier;