
const User=require('../models/user');
const path= require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

function generateAccessToken(id,name){
    
    return jwt.sign({id:id,name:name}, 'secretkey');
}

function isstringinvalid(string){
    if(string == undefined ||string.length === 0){
        return true
    } else {
        return false
    }
}

exports.login = async(req,res,next) =>{
    res.sendFile(path.join(__dirname,'..','views','login.html'))
}


exports.checkuser= async(req,res,next) =>{

    try{ 
          const email = req.body.email;
          const password= req.body.password

            if(isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({message: 'EMail id or password is missing ', success: false})
         }

        const user=  await User.findOne({email:email});
        console.log(user)
         
        
          if(user)
          {
              
              bcrypt.compare(password,user.password, async(err,result)=>{
                if (err) 
                {
                  throw new err("something Went Wrong")
                }  
                if(result==true)
                {
                    return res.status(200).json({success:true, message: "User has been logged in successfully",token:generateAccessToken(user._id,user.name)});

                }
                else
                {
                    return res.status(400).json({success: false, message: 'Password is incorrect'})
                }
            }) 
          }
          else 
          {
              return res.status(404).json({success: false,message: 'user not exist'})
          }
       
    }
    catch(err){
        console.log(err)
        res.status(500).json({err})
    }
}

