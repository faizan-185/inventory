const express = require("express");
const router = express.Router();
const sequelize = require("../database");
const Product = require("../models/product");
const Supplier = require("../models/supplier");
const User = require("../models/user");
const { Op } = require("sequelize");
const Sequelize = require('sequelize');
const { getIndicationDate } = require("./authentication");

router.post("/create", async (req, res) => {
  try {
    const { data } = req.body;
    for (productData of data) {
      productData['total_qty'] = productData.qty
    }
    sequelize.sync().then(() => {
      Product.bulkCreate(data).then(resp => {
        res.status(200).send(resp);
      }).catch((error) => {
        res.status(500).send('Failed to create new record : ' + error);
      })
    });
  } catch (error) {
    res.send('Failed to create new record : ' + error.message);
  }

})

router.delete('/delete', async (req, res) => {
  try {
    const { ids } = req.body;
    sequelize.sync().then(() => {

      Product.destroy({
        where: {
          id: ids
        }
      }).then(() => {
        res.send("Successfully deleted record.")
      }).catch((error) => {
        res.status(500).send('Failed to delete record : ' + error);
      })
    })
  } catch (error) {
    res.status(500).send('Failed to delete record : ' + error);
  }

});

router.get('/showAll', async (req, res) => {
  try {
    sequelize.sync().then(() => {

      Product.findAll({
        include: [{
          model: Supplier,
          attributes: ["id", "name", "category", "company", "phone", "address"]
        }

        ]
      }).then(resp => {
        res.send(resp);
      }).catch((error) => {
        res.status(500).send('Failed to retrieve data : ' + error);
      })
    })
  } catch (error) {
    res.status(500).send('Failed to retrieve data : ' + error);
  }



});
router.get('/show', async (req, res) => {
  try {
    const { prompt } = req.body
    sequelize.sync().then(() => {

      Product.findOne({
        where: prompt,
        include: [
          {
            model: Supplier,
            attributes: ["id", "name", "category", "company", "phone", "address"]
          }
        ]
      }).then(resp => {
        res.send(resp)
      }).catch((error) => {
        res.status(500).send('Failed to retrieve data : ' + error);
      })
    })
  } catch (error) {
    res.status(500).send('Failed to retrieve data : ' + error);
  }

});

router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { prompt } = req.body;
    prompt['total_qty'] = prompt.qty
    sequelize.sync().then(() => {

      Product.update(prompt, {
        where: {
          id: JSON.parse(id)
        }
      }).then(() => {
        res.status(200).send("Updated Successfully!")
      }).catch((error) => {
        res.status(500).send('Failed to update record : ' + error);
      })
    })
  } catch (error) {
    res.status(500).send('Failed to update record : ' + error);
  }

});

router.get('/indication', async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
    const userId = req.body.user.id

    if (startDate === "undefined" || endDate === "undefined" || startDate === "null" || endDate === "null") {
      const user = await User.findByPk(userId)
      startDate = user?.indication_date?.startDate
      endDate = user?.indication_date?.endDate
    }

    let deadProducts = []
    let sellingProducts = []
    let qtyIndication = []
    if (!startDate || !endDate || startDate === "undefined" || endDate === "undefined" || startDate === "null" || endDate === "null") {
      res.status(200).send({ sellingProducts, deadProducts, qtyIndication, date: "Not available" })
    } else {

      sequelize.sync().then(async () => {
        const deadProductsThreshold = 80;
        const sellingProductsThreshold = 50;
        const qtyIndicationThreshold = 5
        await Product.findAll({
          where: {
            [Op.and]: [
              {
                qty: {
                  [Op.ne]: null
                },
              },
              Sequelize.literal(`(qty / total_qty) * 100 >= ${deadProductsThreshold}`),
              {
                createdAt: {
                  [Op.between]: [startDate, endDate]
                },
              }
            ],
          },
          include: [
            {
              model: Supplier,
              attributes: ["id", "name", "category", "company", "phone", "address"]
            }
          ]
        })
          .then((products) => {
            for (const product of products) {
              product.dataValues["sold_qty"] = `sold ${product.total_qty - product.qty} out of ${product.total_qty}  `
            }
            deadProducts = products
          })
          .catch((error) => {
            res.status(500).send(`Some error occurred while fetching dead products: ${error}`);
          });

        await Product.findAll({
          where: {
            [Op.and]: [
              {
                qty: {
                  [Op.ne]: null
                },
              },
              Sequelize.literal(`(qty / total_qty) * 100 <= ${sellingProductsThreshold}`),
              {
                createdAt: {
                  [Op.between]: [startDate, endDate]
                },
              }
            ],
          },
          include: [
            {
              model: Supplier,
              attributes: ["id", "name", "category", "company", "phone", "address"]
            }
          ]
        })
          .then((products) => {
            for (const product of products) {
              product.dataValues["sold_qty"] = `sold ${product.total_qty - product.qty} out of ${product.total_qty}  `
            }
            sellingProducts = products
          })
          .catch((error) => {
            res.status(500).send(`Some error occurred while fetching dead products: ${error}`);
          });

        await Product.findAll({
          where: {
            [Op.and]: [
              {
                qty: {
                  [Op.ne]: null
                },
              },
              Sequelize.literal(`qty <= ${qtyIndicationThreshold}`),
              {
                createdAt: {
                  [Op.between]: [startDate, endDate]
                },
              }
            ],
          },
          include: [
            {
              model: Supplier,
              attributes: ["id", "name", "category", "company", "phone", "address"]
            }
          ]
        })
          .then((products) => {
            qtyIndication = products
          })
          .catch((error) => {
            res.status(500).send(`Some error occurred while fetching qty indication products: ${error}`);
          });

        res.status(200).send({ sellingProducts, deadProducts, qtyIndication, date: { startDate, endDate } })
      })
    }

  } catch (error) {
    res.status(500).send('Failed to get the indications : ' + error);
  }

});
module.exports = router;

