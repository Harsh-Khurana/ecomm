const express = require('express');
require('dotenv').config();
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductRouter = require('./routes/admin/products');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/carts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended : true }));
app.use(cookieSession({
    keys : [process.env.COOKIE_SECRET]
}))
app.use(authRouter);
app.use(adminProductRouter);
app.use(productRouter);
app.use(cartRouter);

app.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`);
})