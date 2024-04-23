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
            userId:req.user._id})
        
        
        res.json(expensedata)
    }
    catch(e)
    {   
       
        res.status(500).json({e})
    }
}


exports.expenseSheet= async(req,res,next) =>{
    try{
        
        const sheet= await Expense.find({userId:req.user._id})
        const premiumcheck= await User.findById(req.user._id);
        
        res.status(201).json({expenses:sheet,premium:premiumcheck});
    }
    catch(e){
        res.status(500).json(e);
    }
}

exports.deleteExpense= async(req,res,next) =>{
    try{
       
        const id = req.params.id;
        const response=await Expense.findByIdAndDelete({_id:id})
       
        res.json({message:'Expense  Deleted'});

    }
    catch(e)
    { 
      
        console.log(e)
    }
}


exports.updateTotalExpense=async (req,res,next)=>{

    try{
      
        const a= await Expense.sum('expenseAmount',{userId:req.user._id})
      //  const data= await Expense.find({userId:req.user.aai})
        const userupdate= await User.updateOne({'totalExpenses':a},{_id:req.user._id})
      
        res.json(userupdate);
     }
     catch(e){
       
        console.log(e)
    }
 }

 exports.downloadexpense= async(req,res,next) =>{
 
    try{
        const userid= req.user._id;
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
        let totalExpenses = await Expense.count({userId:req.user._id});

       // console.log(totalExpenses);
        const start_index= (page-1)*pageSize +1;
        let last_index=start_index+(pageSize-1);
        if(last_index>totalExpenses)
        last_index=totalExpenses;

        const data=await req.user.getExpenses({
               offset:(page-1)*pageSize,
               limit: pageSize,
               order:[['id','DESC']]
        })

        res.status(200).json({
           allExpenses: data,
           check,
           start_index,
           last_index,           
           lastPage: Math.ceil(totalExpenses / pageSize) 
        })

    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: err });
    }
}


