const path= require('path');
const Expense= require('../models/expense');
const User= require('../models/user');
//const sequelize = require('../util/database');
const s3service = require('../service/s3service');
const userservices= require('../service/userservices')
const Downloadfile=require('../models/downloadfile')


exports.expensePage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','expense.html'));
}


exports.addExpense= async(req,res,next) =>
{
   
    try{
       
        const expenseAmount=req.body.expenseAmount;
        const expenseDescription=req.body.expenseDescription;
        const expenseCategory=req.body.expenseCategory;

            const expensedata= await Expense.create({
            expenseAmount:expenseAmount,
            expenseDescription:expenseDescription,
            expenseCategory:expenseCategory,
            userId:req.user.id})

            const user= await User.findOne({_id:req.user.id})
            .select('totalExpenses')

            const expense=Number(user.totalExpenses) + Number( expenseAmount)

            const ex= await req.user.updateOne({totalExpenses:expense})
            console.log(ex)
        
        
        res.json(expensedata)
    }
    catch(e)
    {   console.log(e)
       
        res.status(500).json({e})
    }
}


/*exports.expenseSheet= async(req,res,next) =>{
    try{
        
        const sheet= await Expense.find({userId:req.user.id})
        const premiumcheck= await User.findById(req.user.id);
        
        res.status(201).json({expenses:sheet,premium:premiumcheck});
    }
    catch(e){
        res.status(500).json(e);
    }
}*/

exports.deleteExpense= async(req,res,next) =>{
    try{

        const user= await User.findOne({_id:req.user.id})
        .select('totalExpenses')
    

        const id = req.params.id;
        const response=await Expense.findByIdAndDelete({_id:id})
        
        const expense=user.totalExpenses-response.expenseAmount
      

       const ex= await req.user.updateOne({totalExpenses:expense})
       //console.log(ex)
       
        res.json({message:'Expense  Deleted'});

    }
    catch(e)
    { 
      
        console.log(e)
    }
}


exports.updateTotalExpense=async (req,res,next)=>{

    try{
      
       const a= await Expense.aggregate([
        {$match: {'userId':req.user.id}},
        {$group: {_id :'$userId', sum:{$sum:"$expenseAmount"}}     
        }])
       
    
       let n=a[0].sum
        const userupdate= await req.user.updateOne({totalExpenses:n})
      
        res.json(userupdate);
     }
     catch(e){
       
        console.log(e)
    }
 }

 exports.downloadexpense= async(req,res,next) =>{
 
    try{
        const userid= req.user.id;
        const expensedata = await userservices.getExpenses(req)
        const stringfyexpensedata= JSON.stringify(expensedata)

        
        const filename = `Expense${userid}/${new Date()}.txt`;
        const fileURL = await s3service.uploadToS3(stringfyexpensedata,filename)
        res.status(200).json({ fileURL, success: true, err: null });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ fileURL: '', success: false, err: err })
    }

   
 }

 exports.getExpenses = async (req, res, next) => {
    try {
      
        const check = req.user.ispremiumuser; 
        const page = +req.query.page;
        
        const pageSize = +req.query.pageSize;
        console.log(page , pageSize);
        let totalExpenses = await Expense.countDocuments({userId:req.user.id});
        
       const start_index= (page-1)*pageSize +1;
        let last_index=start_index+(pageSize-1);
        if(last_index>totalExpenses)
        last_index=totalExpenses;

        let n=(page-1)*pageSize
        
        await Expense.find({userId:req.user.id})
        .skip(n)
        .limit(pageSize)
        .sort({_id:1})
        .then((data)=>{
            res.status(200).json({
                allExpenses: data,
                check,
                start_index,
                last_index,           
                lastPage: Math.ceil(totalExpenses / pageSize) 
             })
        })
       
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: err });
    }
}


