const mongoose = require('mongoose')
const Schema= mongoose.Schema

const passwordRequestSchema = new Schema({
   /* id:{
        type:Sequelize.UUID,
        allowNull: false,
        primaryKey:true
    }, */
    isActive:
    {
        type:Boolean,
        required:true 
    },
    userId:{
        type:Schema.Types.ObjectId,   
        ref:'User',
        required:true

    }
})

module.exports= mongoose.model('Forgotpassword',passwordRequestSchema)