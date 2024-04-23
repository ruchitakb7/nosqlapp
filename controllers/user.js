const User=require('../models/user');
const bcrypt= require('bcrypt');
const path= require('path');


exports.signupage= (req,res,next)=>{

    res.sendFile(path.join(__dirname, '..','views','signup.html'))

}

exports.signupdetails= async (req,res,next) =>{
    try{

    const name= req.body.name;
    const email=req.body.email;
    const password= req.body.password;
  
            const saltrounds=8;
            bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err)

            const signupdetail= await User.create({name:name,email:email,password:hash})

             res.status(201).json({message:"User has been successfully logged in"});
          })
    }
    catch(e)
    {
        res.status().json({error:e})
    }
}


exports.checkemail= async(req,res,next) =>{
    try{
       
        const checkinfo= await User.find();
       
        res.status(201).json(checkinfo)
    }
    catch(e){
        res.status(400).json({error:e})
    }
}