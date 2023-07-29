const express =require('express');
const cors =require("cors");
const dotenv=require("dotenv");
const middleware=require("./middleware")

dotenv.config();
const app = express();
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());


app.use('/authentication',require("./routes/authentication"));
app.use('/customer',middleware,require("./routes/customer"));
app.use('/supplier',middleware,require("./routes/supplier"));
app.use('/product',middleware,require("./routes/product"));
app.use('/pricing',middleware,require("./routes/pricing"));
app.use('/pricing_item',middleware,require("./routes/pricing_item"));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`) });