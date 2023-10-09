const { DataTypes } = require('sequelize');
const Supplier = require("./supplier");
const sequel = require("../database.js");

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
  size: {
    type: DataTypes.STRING,
  },
  code: {
    type: DataTypes.STRING,
  },
  qty: {
    type: DataTypes.INTEGER,
  },
  price: {
    type: DataTypes.FLOAT,
  },
  deliveryCost: {
    type: DataTypes.FLOAT,
  },
  additionalCost: {
    type: DataTypes.FLOAT,
  },
  total_qty:{
    type: DataTypes.INTEGER
  },
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  // Enable soft deletion
  paranoid: true,
});
// Create relation between Supplier and the product (you will get a supplierId colum in products colum list):

Supplier.hasMany(Product);

Product.belongsTo(Supplier, {
  targetKey: "id",
})

sequel.sync().then(() => {
  console.log('Product table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

module.exports = Product;