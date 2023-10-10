const express =require('express');
const http = require('http');
const cors =require("cors");
const dotenv=require("dotenv");
const middleware=require("./middleware")
const socketIo = require('socket.io');
const sequelize = require("./database");
const User = require("./models/user");
const Login = require("./models/login");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the actual origin of your client app
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('/Users/dev/Documents/inventory/backend/uploads'));
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your client app's URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');
});


app.use('/authentication', require("./routes/authentication"));
app.use('/customer', middleware, require("./routes/customer"));
app.use('/supplier', middleware, require("./routes/supplier"));
app.use('/product', middleware, require("./routes/product"));
app.use('/pricing', middleware, require("./routes/pricing"));
app.use('/pricing_item', middleware, require("./routes/pricing_item"));
app.use('/profit', middleware, require("./routes/profit"));
app.use('/worker', middleware, require("./routes/worker"));
app.use('/login', require("./routes/login"));
app.post('/login/request',  (req, res) => {
  try {
    const { username } = req.body;
    sequelize.sync().then(() => {
      User.findOne({ where: { username } }).then((user) => {
        if (user) {
          Login.findOne({ where: { user_id: user.id } }).then((login) => {
            if (login) {
              return res.status(200).json({ error: 'Login request already exists for this user' });
            } else {
              Login.create({
                user_id: user.id,
              }).then((record) => {
                io.emit('request', {
                  message: 'New login request created',
                  record,
                  user
                });
                res.status(201).json({ message: 'Login record created successfully', record });
              }).catch((error) => {
                res.status(400).json({ error: 'Request not created!' });
              });
            }
          })
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      }).catch((error) => {
        res.status(404).json({ error: 'User not found' });
      });
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.patch('/login/update/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { expiration_hours, expiration_minutes, status, username } = req.body;
    sequelize.sync().then(() => {
      Login.update({
        expiration_hours, expiration_minutes, status
      },{
        where: {
          id: JSON.parse(id)
        },
      }).then((r) => {
        io.emit('approved', {
          message: 'New login request approved',
          id, username
        });
        res.status(200).send("Updated Successfully!")
      }).catch ((error)=>{
        res.status(500).send('Failed to update record : ' + error);
      })
    })
  } catch (error) {
    res.status(500).send('Failed to update record : ' + error);
  }

});


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`) });

module.exports = {
  app,
  io
};