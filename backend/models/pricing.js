const { DataTypes } = require("sequelize");
const Customer = require("./customer");
const sequel = require("../database.js");

const Pricing = sequel.define("pricing", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  gatepass_no: {
    type: DataTypes.STRING,
  },
  reference: {
    type: DataTypes.STRING,
  },
  total: {
    type: DataTypes.FLOAT,
  },
  discount: {
    type: DataTypes.FLOAT,
  },
  tax: {
    type: DataTypes.FLOAT,
  },
  gross: {
    type: DataTypes.FLOAT,
  },
  type: {
    type: DataTypes.STRING,
  },
  return_ref: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
// Create relation between Pricing and the Customer: "
Customer.hasMany(Pricing);

Pricing.belongsTo(Customer, {
  targetKey: "id",
});

sequel
  .sync()
  .then(() => {
    console.log("Pricing table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = Pricing;
