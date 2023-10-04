const { DataTypes } = require("sequelize");
const Pricing = require("./pricing");
const Product = require("./product");
const sequel = require("../database.js");

const PricingItem = sequel.define("pricing_item", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  unit_price: {
    type: DataTypes.FLOAT,
  },
  qty: {
    type: DataTypes.INTEGER,
  },
  return_qty: {
    type: DataTypes.INTEGER,
  },
  total: {
    type: DataTypes.FLOAT,
  },
});

Pricing.hasMany(PricingItem);

PricingItem.belongsTo(Pricing, {
  targetKey: "id",
});

Product.hasMany(PricingItem);

PricingItem.belongsTo(Product, {
  targetKey: "id",
});

sequel
  .sync()
  .then(() => {
    console.log("PricingItem table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = PricingItem;
