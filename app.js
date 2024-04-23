const express= require('express');

const app= express();
const mongoose= require('mongoose')
const path=require('path');
const dotenv = require('dotenv');
dotenv.config()



//const seq = require('./util/database.js');
const User= require('./models/user.js');
const Expense= require('./models/expense.js');
const Order = require('./models/order.js');
const forgotpasswordRequest = require('./models/forgotPasswordRequest.js');


app.use(express.json());
app.use(express.static('public')) 
app.use(express.static(path.join(__dirname, "views"))) 


const signuprouterFile= require('./routes/signuprouter.js');   
app.use(signuprouterFile);
const loginrouterFile = require('./routes/loginrouter.js');
app.use(loginrouterFile);
const expenseRouterFile= require('./routes/expense.js');
app.use(expenseRouterFile);
const orderRouterfile= require('./routes/order.js')
app.use(orderRouterfile);
const premiumRouterfile= require('./routes/premium.js');
app.use(premiumRouterfile);
const forgotpassword= require('./routes/forgotpassword.js');
app.use(forgotpassword);


/*User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


User.hasMany(forgotpasswordRequest)
forgotpasswordRequest.belongsTo(User);

seq.sync()
.then(res=>
   { 
    app.listen(process.env.port);  
})                               
.catch((e)=>{
   console.log(e)

}) */

mongoose.connect('mongodb+srv://ruchitakb7:itkUTB0fpkreZHDH@cluster0.7iolqg4.mongodb.net/expense?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
   app.listen(3000)
   console.log('connected')
})
.catch((e)=>{
   console.log(e)
})
