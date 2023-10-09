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
const { where } = require("sequelize");
const writeFileAsync = promisify(fs.writeFile);
const { Op } = require("sequelize");
const Sequelize = require('sequelize')


const pricing_include_association = [
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
]

router.post("/create", async (req, res) => {
  try {
    const { customer_id, gatepass_no, reference, total, discount, tax, gross, pricing_items, type } = req.body;
    sequelize.sync().then(() => {
      Pricing.create({
        customerId: customer_id,
        gatepass_no: gatepass_no,
        reference: reference,
        total: total,
        discount: discount,
        tax: tax,
        gross: gross,
        type: type
      })
        .then((resp) => {
          const pricing_id = resp.id;
          pricing_items.map((pricing_item) => pricing_item.pricingId = pricing_id);
          PricingItem.bulkCreate(pricing_items).then(response => {
            for (const item of pricing_items) {
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
    const pricingItemIds = []
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
            Pricing.findAll({
              where: {
                return_ref: pricing.id
              },
              include: PricingItem,
            }).then(async responses => {
              if (responses.length) {
                for (const response of responses) {
                  pricing?.pricing_items.forEach((pricingItem, index) => {
                    let return_qty
                    if (response.pricing_items?.length) {
                      pricingItemIds.push(pricingItem.id, response.pricing_items[index]?.id)
                      return_qty = response.pricing_items[index]?.return_qty
                    } else {
                      pricingItemIds.push(pricingItem.id)
                      return_qty = 0
                    }
                    const product = pricingItem.product;
                    if (product) {
                      product.qty += pricingItem.qty
                      product.qty += return_qty
                      return product.save()
                    }
                  })
                }
              } else {
                pricing?.pricing_items.forEach(pricingItem => {
                  pricingItemIds.push(pricingItem.id)
                  const product = pricingItem.product;
                  if (product) {
                    product.qty += pricingItem.qty
                    return product.save()
                  }
                })
              }
              console.log(pricingItemIds)
              await Pricing.destroy({
                where: {
                  id: ids,
                },
              })
              await PricingItem.destroy({
                where: {
                  id: pricingItemIds,
                },
              });
              await Pricing.destroy({
                where: {
                  return_ref: ids,
                },
              })
              res.status(200).send("Successfully deleted record.");
            })
          })
      });

    })
  } catch (error) {
    res.status(500).send("Failed to delete record : " + error);
  }
});

router.get("/showAll", async (req, res) => {
  try {
    const pricing_type = req.query.type;
    if (pricing_type == "undefined" || pricing_type === undefined) {
      sequelize.sync().then(() => {
        Pricing.findAll({
          include: pricing_include_association
        })
          .then((resp) => {
            res.send(resp);
          })
          .catch((error) => {
            res.status(500).send("Failed to retrieve data : " + error);
          });
      });
    } else {
      sequelize.sync().then(() => {
        Pricing.findAll({
          where: {
            type: pricing_type
          },
          include: pricing_include_association
        })
          .then((resp) => {
            res.send(resp);
          })
          .catch((error) => {
            res.status(500).send("Failed to retrieve data : " + error);
          });
      });
    }
  } catch (error) {
    res.status(500).send("Failed to retrieve data : " + error);
  }
});
router.get("/show/:id", async (req, res) => {
  try {
    const pricing_type = req.query.type;
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
            attributes: ["id", "unit_price", "qty", "total", "return_qty"],
            include: [
              {
                model: Product,
                attributes: [
                  "id",
                  "name",
                  "qty"
                ],
              },
            ],
          },
        ],
      })
        .then((resp) => {
          if (pricing_type === "return") {
            const data = { resp: resp }
            Pricing.findByPk(resp.return_ref,
              {
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
                          "qty"
                        ],
                      },
                    ],
                  },
                ],
              }).then(NormalPricing => {
                const itemsQty = NormalPricing?.pricing_items.map(item => item.qty)
                data["itemsQty"] = itemsQty
                res.send(data);
              }).catch(err => res.status(500).send("Failed to retrieve data : " + error))
          } else {
            res.send(resp);
          }
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


router.post("/return", async (req, res) => {
  try {
    const { previous_pricing, customer_id, gatepass_no, reference, total, discount, tax, gross, pricing_items, type } = req.body;
    sequelize.sync().then(() => {
      Pricing.create({
        customerId: customer_id,
        gatepass_no: gatepass_no,
        reference: reference,
        total: total,
        discount: discount,
        tax: tax,
        gross: gross,
        type: type,
        return_ref: previous_pricing
      })
        .then((resp) => {
          const pricing_id = resp.id;
          const returnPricingItems = pricing_items.map(item => {
            return {
              unit_price: item.unit_price, qty: item.qty, total: item.total,
              pricingId: pricing_id, productId: item.productId,
              return_qty: item.return_qty
            }
          })
          PricingItem.bulkCreate(returnPricingItems).then(async response => {
            for (const item of pricing_items) {
              Product.findByPk(item.productId).then(product => {
                if (product) {
                  product.update({
                    qty: item.remaining_qty,
                  });
                }
              })
            };
            await updateItems(pricing_items, {
              id: previous_pricing, total: total,
              discount: discount,
              tax: tax,
              gross: gross,
            })
            res.status(200).send(resp);
          })
            .catch((error) => {

              res.status(500).send("Failed to create a new record e1: " + error);
            });
        })
        .catch((error) => {
          res.status(500).send("Failed to create a new record e2: " + error);
        });
    });
  } catch (error) {
    res.send("Failed to create a new record e3: " + error.message);
  }
});


const updateItems = async (pricing_items, pricing) => {
  for (const item of pricing_items) {
    sequelize.sync().then(() => {
      Pricing.update({
        total: pricing.total,
        discount: pricing.discount,
        tax: pricing.tax,
        gross: pricing.gross
      }, {
        where: {
          id: pricing.id
        }
      })
      PricingItem.findByPk(item.id).then(foundItem => {
        if (foundItem) {
          foundItem.update({
            unit_price: item.unit_price, qty: item.qty, total: item.total
          })
        }
      })
    })
  }
  return
}

const updateReturnItems = async (pricing_items, pricing) => {
  let i = 0
  sequelize.sync().then(() => {

    Pricing.update({
      total: pricing.total,
      discount: pricing.discount,
      tax: pricing.tax,
      gross: pricing.gross
    }, {
      where: {
        id: pricing.id
      }
    })
    Pricing.findByPk(pricing.id, {
      include: [
        {
          model: PricingItem,
          include: Product
        }]
    }).then(res => {
      const originalPricingItems = res.pricing_items
      for (const foundItem of originalPricingItems) {
        item = pricing_items[i]
        foundItem.update({
          unit_price: item.unit_price, qty: item.qty, total: item.total
        })
        i++
      }
      return
    })
  })
}

router.delete("/return/delete", async (req, res) => {
  try {
    const { ids } = req.body;
    sequelize.transaction().then(async (t) => {
      const pricingItemsIds = []
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
          }).then(returnPricing => {
            Pricing.findByPk(returnPricing.return_ref, {
              include: [
                {
                  model: PricingItem,
                  include: Product
                }
              ]
            }).then(pricing => {
              returnPricing.pricing_items.forEach((returnPricingItem, index) => {
                pricingItemsIds.push(returnPricingItem.id)
                const product = returnPricingItem.product;
                const pricingItem = pricing.pricing_items[index]
                pricingItem.qty += returnPricingItem.return_qty
                pricingItem.save()
                if (product) {
                  product.qty -= returnPricingItem.return_qty
                  product.save()
                }
              })
              PricingItem.destroy({
                where: {
                  pricingId: pricingItemsIds,
                },
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
            }).catch(err => console.log(err))
          })
      });

    });
  } catch (error) {
    res.status(500).send("Failed to delete record : " + error);
  }
});

router.patch("/return/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { previous_pricing, customer_id, gatepass_no, reference, total, discount, tax, gross, pricing_items } = req.body.pricing;
    sequelize.sync().then(async () => {
      Pricing.update({
        gatepass_no: gatepass_no,
        customerId: customer_id,
        reference: reference,
        total: total,
        discount: discount,
        tax: tax,
        gross: gross,
        type: "return",
        return_ref: previous_pricing
      }, {
        where: {
          id: id
        }
      }).then(async response => {
        for (const item of pricing_items) {
          PricingItem.findByPk(item.id).then(foundItem => {
            if (foundItem) {
              foundItem.update({
                unit_price: item.unit_price, qty: item.qty, total: item.total, return_qty: foundItem.return_qty + item.return_qty
              });
              Product.findByPk(item.productId).then(product => {
                if (product) {
                  product.update({
                    qty: item.remaining_qty,
                  });
                }
              })
            }
          })
        }
        await updateReturnItems(pricing_items, {
          id: previous_pricing, total: total,
          discount: discount,
          tax: tax,
          gross: gross,
        }, res)
      })
      res.status(200).send("Updated Successfully!");
    });
  } catch (error) {
    res.send("Failed to create a new record e3: " + error.message);
  }
});



const calculateExpense = (pricingItem) => {
  const qty = pricingItem.qty;
  const price = pricingItem.product.price;
  const deliveryCost = pricingItem.product.deliveryCost;
  const additionalCost = pricingItem.product.additionalCost;

  return qty * price + deliveryCost + additionalCost;
};

const calculateProfit = (pricing) => {
  const pricingItems = pricing.pricing_items;
  const total = pricing.gross;

  const totalExpense = pricingItems.reduce((acc, item) => {
    const expense = calculateExpense(item);
    return acc + expense;
  }, 0);

  const profit = total - totalExpense;

  return { profit, totalExpense };
};

router.get("/profit", async (req, res) => {
  const { startDate, endDate } = req.query;

  sequelize.sync().then(async () => {
    const pricings = await Pricing.findAll({
      include: [
        {
          model: Customer,
          attributes: [
            "name",
          ],
        },
        {
          model: PricingItem,
          attributes: ["total", "qty"],
          include: [
            {
              model: Product,
              attributes: ["price", "deliveryCost", "additionalCost"],
            },
          ],
        },
      ],
      where: {
        createdAt: {
          [Op.and]: [
            Sequelize.literal('price + deliveryCost + additionalCost > 0'),
            { [Op.gte]: startDate },
            { [Op.lte]: endDate }
          ]
        },
      },
    });
    const format_response = pricings.map((pricing) => {
      const profit = calculateProfit(pricing);

      return {
        id: pricing.id,
        gatepass_no: pricing.gatepass_no,
        date: String(pricing.createdAt).substring(0, 15),
        customer: pricing.customer.name,
        total_price: pricing.gross,
        profit: profit.profit,
        total_expense: profit.totalExpense,
        type: pricing.type
      };
    });
    const totalProfit = format_response.reduce((acc, item) => acc + item.profit, 0);
    const totalExpense = format_response.reduce((acc, item) => acc + item.total_expense, 0);
    const totalRevenue = format_response.reduce((acc, item) => acc + item.total_price, 0);
    res.status(200).send({ format_response, totalProfit, totalExpense, totalRevenue, date: { startDate, endDate } });
  }).catch(err => {
    console.log(`Error${err}`)
    res.send("Failed to create a new record e3: " + err.message);
  })
})

module.exports = router;
