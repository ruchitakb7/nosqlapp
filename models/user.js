const mongoose = require('mongoose')
const Schema= mongoose.Schema

const userSchema = new Schema ({
 /*   id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },*/
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    ispremiumuser: {
        type: Boolean
    //    default: 0
      },
      totalExpenses :{
      type:Number,
     default:0
    }
})

module.exports=mongoose.model('User',userSchema);