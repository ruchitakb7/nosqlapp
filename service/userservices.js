
const Expense= require('../models/expense')

const getExpenses = (req) => {
    return Expense.find({userId:req.user.id});
}

module.exports = {
    getExpenses
}