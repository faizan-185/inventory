const express=require("express");
const router=express.Router();
const sequelize = require("../database");
const User = require("../models/user");
const Login = require("../models/login");


router.get('/getAll', async (req, res) => {
  try {
    // Find all login requests with a status of false and include the associated user
    const requests = await Login.findAll({
      where: { status: false },
      include: [{ model: User }],
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/delete', async(req, res) => {
  try {
    const { ids } = req.body;
    sequelize.sync().then(() => {
      Login.destroy({
        where: {
          id: ids
        }
      }).then(() => {
        res.send("Successfully deleted record.")
      }).catch ((error)=> {
        res.status(500).send('Failed to delete record : ' + error);
      })
    })
  } catch (error) {
    res.status(500).send('Failed to delete record : ' + error);
  }
});

router.post('/check', async (req, res) => {
  try {
    const { id, username } = req.body;
    console.log(id, username)
    try {
      const requests = await Login.findAll({
        where: { id: id, status: true },
        include: [
          {
            model: User,
            where: {
              username: username,
            },
          }],
      });
      res.status(200).json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    res.status(500).send('Failed to delete record : ' + error);
  }
});

module.exports=router;