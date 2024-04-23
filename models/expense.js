const mongoose = require('mongoose')
const Schema= mongoose.Schema


const expenseSchema = new Schema({
  /*  id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },*/
    expenseAmount:{
        type:Number,   
        required:true

    },
    expenseDescription:{
        type:String,   
        required:true

    },
    expenseCategory:{
        type:String,   
        required:true

    },
    userId:{
        type:Schema.Types.ObjectId,   
        ref:'User',
        required:true

    }

})

module.exports= mongoose.model('expense',expenseSchema)