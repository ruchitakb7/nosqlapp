const User=require('../models/user');
const Expense=require('../models/expense');
const Order=require('../models/order');
const sequelize=require('../util/database');


 exports.getleaderboarddata= async (req,res,next)=>{
    try{
        const userdata= await User.find({
          attributes:['name','totalExpenses'],
            order:[['totalExpenses','DESC']]   
        })
      
        res.json(userdata)
    }
    catch(e){
        console.log(e)
    }
 }



 