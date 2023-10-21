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

    const user = await User.findByPk(userId)
    if (startDate === "undefined" || endDate === "undefined" || startDate === "null" || endDate === "null") {
      startDate = user?.indication_date?.startDate
      endDate = user?.indication_date?.endDate
    }

    let deadProducts = []
    let sellingProducts = []
    let qtyIndication = []
    if (!startDate || !endDate || startDate === "undefined" || endDate === "undefined" || startDate === "null" || endDate === "null") {
      res.status(200).send({ sellingProducts, deadProducts, qtyIndication, date: "Not available" })
    } else {
      const deadProductsQuery = `SELECT p.*, sup.name As supplier_name
        FROM products p 
        LEFT JOIN pricing_items pi2 
          ON p.id = pi2.productId 
          AND pi2.createdAt BETWEEN '${startDate}' AND '${endDate}' 
        JOIN suppliers sup
          ON p.supplierId = sup.id
        WHERE (p.createdAt < '${startDate}' OR p.createdAt < '${endDate}') 
          AND pi2.id IS NULL;
      `;
      const deadProducts = await sequelize.query(deadProductsQuery, { type: sequelize.QueryTypes.SELECT })

      const bestSellingProductsQuery = `SELECT p.*, COUNT(s.productId) AS sales_count, sup.name As supplier_name
        FROM products p
        INNER JOIN pricing_items s
          ON p.id = s.productId
          AND s.createdAt BETWEEN '${startDate}' AND '${endDate}'
        JOIN suppliers sup
          ON p.supplierId = sup.id
        WHERE p.createdAt >'${startDate}' OR p.createdAt > '${endDate}'
          AND s.id IS NOT NULL
        GROUP BY p.id
        ORDER BY sales_count DESC
        LIMIT 10;`
      sellingProducts = await sequelize.query(bestSellingProductsQuery, { type: sequelize.QueryTypes.SELECT })

      sequelize.sync().then(async () => {
        const qtyIndicationThreshold = user?.indication_date?.indication_qty ? user?.indication_date?.indication_qty : 5

        qtyIndication = await Product.findAll({
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
      })

      res.status(200).send({ sellingProducts, deadProducts, qtyIndication, date: { startDate, endDate } })


    }

  } catch (error) {
    res.status(500).send('Failed to get the indications : ' + error);
  }

});
module.exports = router;

