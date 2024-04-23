const Razorpay = require('razorpay');

const jwt = require('jsonwebtoken');

const Order = require('../models/order');

function generateAccessToken(id, name,ispremiumuser){
    return jwt.sign({id:id, name:name, ispremiumuser}, 'secretkey');
}

const purchasepremium = async (req, res) => {
    try {
        
        var rzp = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        })

        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, (err, order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            Order.create({orderid:order.id, status: 'PENDING',userId:req.user._id}).then(()=>{
                return res.status(201).json({order, key_id:rzp.key_id});
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({message:'someting went wrong', error:err});
    }
}

const updateTransactionStatus = async (req, res) => {
    try {
        
        const {payment_id, order_id} = req.body;
        
        const order = await Order.findOne({orderid:order_id});
        
        if(!order)
        {
            console.log('no order is available');
        }
        
        const promise1 = order.updateOne({paymentid:payment_id, status:'SUCEESSFUL'})
        const promise2 =  req.user.update({ispremiumuser:true})
                    
        await Promise.all([promise1, promise2]);
        
        return res.status(202).json({success:true, message:"Transaction Successful",token:generateAccessToken(req.user._id, req.user.name, true)})
                
    } catch(err) {
        console.log(err);
        res.status(403).json({message:'something went wrong',err})
    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
}