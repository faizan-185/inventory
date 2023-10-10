const multer = require('multer');
const express=require("express");
const router=express.Router();
const User=require("../models/user");
const sequelize = require("../database");
const Login = require("../models/login");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the upload destination directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name as the uploaded file name
  },
});

const upload = multer({ storage: storage });

function generateRandomPassword() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateUniqueUsername(name) {
  // You can implement your own logic to generate a unique username based on the provided name.
  // For simplicity, we'll just use the first name and a random number.
  return name.split(' ')[0].toLowerCase() + Math.floor(1000 + Math.random() * 9000).toString();
}

router.post("/create", upload.single('picture'), async(req,res)=>{
  try {
    const { name, fatherName, cnic, contact, address, reference } = req.body;
    const role = 'worker';
    const picture = req.file.filename;
    const username = generateUniqueUsername(name);
    const password = generateRandomPassword();
    sequelize.sync().then(() => {
      User.create({
        name,
        fatherName,
        cnic,
        contact,
        address,
        reference,
        role,
        picture,
        username,
        password }).then(resp => {
        res.status(200).send(resp);
      }).catch ((error)=> {
        res.status(500).send('Failed to create a new record : ' + error);
      })
    });
  } catch (error) {
    res.status(500).send('Failed to create a new record : ' + error.message);
  }
})

router.get('/showAll', async(req, res) => {
  try {
    sequelize.sync().then(() => {
      User.findAll(
        {
          where: {
            role: 'worker',
          }
        }).then(resp => {
        res.send(resp);
      }).catch ((error)=> {
        res.status(500).send('Failed to retrieve data : ' + error);
      })
    })
  } catch (error) {
    res.status(500).send('Failed to retrieve data : ' + error);
  }
});

router.delete('/delete', async(req, res) => {
  try {
    const { ids } = req.body;
    sequelize.sync().then(() => {
      User.destroy({
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

router.patch('/update/:id', upload.single('picture'),async(req, res) => {
  try {
    const id = req.params.id;
    const { name, fatherName, cnic, contact, address, reference } = req.body;
    let picture = ''
    if (req.file) {
      picture = req.file.filename;
    }
    sequelize.sync().then(() => {
      User.update(req.file ? {
        name, fatherName, cnic, contact, address, reference, picture
      } : {
        name, fatherName, cnic, contact, address, reference
      },{
        where: {
          id: JSON.parse(id)
        },
        returning: true
      }).then(() => {
        res.status(200).send("Updated Successfully!")
      }).catch ((error)=>{
        res.status(500).send('Failed to update record : ' + error);
      })
    })
  } catch (error) {
    res.status(500).send('Failed to update record : ' + error);
  }

});

module.exports=router;