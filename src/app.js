console.log('any')
const express = require('express')
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const orderRouter = require('./routes/orderRoutes')
const tagRouter = require('./routes/tagRoutes')
const addressRouter = require('./routes/addressRoutes')
const voucherRouter = require('./routes/voucherRoutes')
const sequelize = require('./config/database');
const sync = require('./sync')
const bodyParser = require('body-parser');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController')
const dotenv = require("dotenv");

dotenv.config(); 



const app = express()
 sync.syncModels()
app.use(bodyParser.json())
app.use('/api/v1/auth/',authRouter)
app.use('/api/v1/users/',userRouter) 
app.use('/api/v1/products/',productRouter)
app.use('/api/v1/orders/',orderRouter) 
app.use('/api/v1/tags/',tagRouter) 
app.use('/api/v1/addresses/',addressRouter) 
app.use('/api/v1/vouchers/',voucherRouter) 


app.all('*',(req,res,next)=>{
  next(new AppError(`can't find ${req.originalUrl}`,404))
})



app.use(errorHandler)


 

const PORT = process.env.PORT || 4000;
 app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

