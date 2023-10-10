const { DataTypes } = require('sequelize');

const sequel =require("../database.js");
const User = require("./user");

const Login = sequel.define("logins", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  expiration_hours: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  expiration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},
  {
    timestamps: true, // Add this line to include createdAt and updatedAt columns
  }
  );

User.hasOne(Login, { foreignKey: 'user_id' });
Login.belongsTo(User, { foreignKey: 'user_id' });

sequel.sync().then(() => {
  console.log('Login table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

module.exports = Login;