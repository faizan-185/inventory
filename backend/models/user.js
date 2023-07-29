const { DataTypes } = require('sequelize');
const sequel =require("../database.js");

const User = sequel.define("user", {
   id: {
     type: DataTypes.INTEGER,
     autoIncrement: true,
     primaryKey: true
   },
   name: {
     type: DataTypes.STRING,
     defaultValue: 'Admin'
   },
   password:{
    type:DataTypes.STRING,
    defaultValue: '1234'
   }
});

sequel.sync().then(() => {
   console.log('User table created successfully!');
}).catch((error) => {
   console.error('Unable to create table : ', error);
});

module.exports= User;