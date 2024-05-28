const User=require('../models/user');
const Expense=require('../models/expense');
const Order=require('../models/order');
const sequelize=require('../util/database');


 exports.getleaderboarddata= async (req,res,next)=>{
    try{
         await User.find()
         .select('name totalExpenses')
         .sort({totalExpenses:-1})
          .then((userdata)=>{
            res.json(userdata)
          })

         // attributes:['name','totalExpenses'],
          //  order:[['totalExpenses','DESC']]   
      //  })
      
        
    }
    catch(e){
        console.log(e)
    }
 }



 