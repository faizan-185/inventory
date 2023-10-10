const { DataTypes } = require('sequelize');
const sequel =require("../database.js");

const User = sequel.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    defaultValue: ''
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  fatherName: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  cnic: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  contact: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  address: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  reference: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
   password:{
    type:DataTypes.STRING,
    defaultValue: ''
   },
  picture: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'worker'
  },
  indication_date: {
    type: DataTypes.JSON,
  },
});

sequel.sync().then(() => {
   console.log('User table created successfully!');
}).catch((error) => {
   console.error('Unable to create table : ', error);
});

module.exports= User;