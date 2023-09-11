const express = require("express");
const router = express.Router();
const sequelize = require("../database");
const Pricing = require("../models/pricing");
const PricingItem = require("../models/pricing_item");
const Customer = require("../models/customer");
const Product = require("../models/product");
const axios = require('axios');
const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const writeFileAsync = promisify(fs.writeFile);

router.post("/create", async (req, res) => {
  try {
    const { customer_id, gatepass_no, reference, total, discount, tax, gross, pricing_items } = req.body;
    sequelize.sync().then(() => {
      Pricing.create({
        customerId: customer_id,
        gatepass_no: gatepass_no,
        reference: reference,
        total: total,
        discount: discount,
        tax: tax,
        gross: gross,
      })
        .then((resp) => {
          const pricing_id = resp.id;
          pricing_items.map((pricing_item) => pricing_item.pricingId = pricing_id);
          PricingItem.bulkCreate(pricing_items).then(response => {
            for (const item of pricing_items){
              Product.findByPk(item.productId).then(product => {
                if (product) {
                  product.update({
                    qty: product.qty - item.qty,
                  });
                }
              })
            };
            res.status(200).send(resp);
          })
          .catch((error) => {

            res.status(500).send("Failed to create a new record : " + error);
          });
        })
        .catch((error) => {
          res.status(500).send("Failed to create a new record : " + error);
        });
    });
  } catch (error) {
    res.send("Failed to create a new record : " + error.message);
  }
});


router.post("", async (req, res) => {
  try {
    const { id, customer_id, gatepass_no, reference, total } = req.body;
    sequelize.sync().then(() => {
      Pricing.create({
        id: id,
        customerId: customer_id,
        gatepass_no: gatepass_no,
        reference: reference,
        total: total,
      })
        .then((resp) => {
          res.status(200).send(resp);
        })
        .catch((error) => {
          res.status(500).send("Failed to create a new record : " + error);
        });
    });
  } catch (error) {
    res.send("Failed to create a new record : " + error.message);
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { ids } = req.body;
    sequelize.transaction().then(async (t) => {
      ids.forEach(id => {
        Pricing.findByPk(
          id,
          {
            include: [
              {
                model: PricingItem, 
                include: Product
              }
            ], 
            transaction: t
          }).then(pricing => {
            pricing?.pricing_items.forEach(pricingItem => {
              const product = pricingItem.product;
              if (product) {
                product.qty += pricingItem.qty
                return product.save()
              }
            })
            return PricingItem.destroy({
              where: {
                pricingId: pricing.id,
              },
            });
        })
      });
      
      Pricing.destroy({
        where: {
          id: ids,
        },
      })
        .then(() => {
          res.status(200).send("Successfully deleted record.");
        })
        .catch((error) => {
          res.status(500).send("Failed to delete record : " + error);
        });
    });
  } catch (error) {
    res.status(500).send("Failed to delete record : " + error);
  }
});

router.get("/showAll", async (req, res) => {
  try {
    sequelize.sync().then(() => {
      Pricing.findAll({
        include: [
          {
            model: Customer,
            attributes: [
              "id",
              "name",
              "category",
              "reference",
              "phone",
              "address",
            ],
          },
          {
            model: PricingItem,
            attributes: ["id", "unit_price", "qty", "total"],
            include: [
              {
                model: Product,
                attributes: [
                  "name",
                  "godown",
                  "company",
                  "thickness",
                  "size",
                  "code",
                  "price",
                  "deliveryCost",
                  "additionalCost",
                ],
              },
            ],
          },
        ],
      })
        .then((resp) => {
          res.send(resp);
        })
        .catch((error) => {
          res.status(500).send("Failed to retrieve data : " + error);
        });
    });
  } catch (error) {
    res.status(500).send("Failed to retrieve data : " + error);
  }
});
router.get("/show/:id", async (req, res) => {
  try {
    const id = req.params.id;
    sequelize.sync().then(() => {
      Pricing.findOne({
        where: {
          id: id
        },
        include: [
          {
            model: Customer,
            attributes: [
              "id",
              "name",
            ],
          },
          {
            model: PricingItem,
            attributes: ["id", "unit_price", "qty", "total"],
            include: [
              {
                model: Product,
                attributes: [
                  "id",
                  "name",
                ],
              },
            ],
          },
        ],
      })
        .then((resp) => {
          res.send(resp);
        })
        .catch((error) => {
          res.status(500).send("Failed to retrieve data : " + error);
        });
    });
  } catch (error) {
    res.status(500).send("Failed to retrieve data : " + error);
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { pricing } = req.body;
    const pricingItems = [...pricing.pricing_items];
    delete pricing.pricing_items;
    sequelize.sync().then(() => {
      Pricing.findByPk(
        id,
        {
          include: [
            {
              model: PricingItem,
              include: Product
            }]
        })
        .then(actualPricing => {
        actualPricing.pricing_items.forEach(item => {
          if (item?.product) {
            item.product.qty += item.qty;
            item.product.save();
          }
        })
        PricingItem.destroy({
          where: {
            pricingId: id
          }
        })
          .then(response => {
            Pricing.update(pricing, {
              where: {
                id: JSON.parse(id),
              },
            })
              .then(() => {
                const newPricingItems = pricingItems.map((pricing_item) => {
                  pricing_item.pricingId = id
                  return pricing_item;
                });
                PricingItem.bulkCreate(newPricingItems).then(response => {
                  for (const item of newPricingItems) {
                    if (item?.productId) {
                      Product.findByPk(item.productId).then(product => {
                        if (product) {
                          product.update({
                            qty: product.qty - item.qty,
                          });
                        }
                      }).catch(err => {
                        res.status(500).send("Failed to update record : " + err);
                      })
                    }
                  }
                  res.status(200).send("Updated Successfully!");
                }).catch(err => {
                  res.status(500).send("Failed to update record : " + err);
                })
              }).catch(err => {
              res.status(500).send("Failed to update record : " + err);
            });
              })
          .catch((error) => {
                res.status(500).send("Failed to update record : " + error);
              });
        }).catch(err => {
        res.status(500).send("Failed to update record : " + err);
        })
      }).catch((error) => {
      res.status(500).send("Failed to update record : " + error);
      })
  } catch (error) {
    res.status(500).send("Failed to update record : " + error);
  }
});

module.exports = router;
