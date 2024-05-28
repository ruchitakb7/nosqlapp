const express = require('express');
const router = express.Router();


const expenseController= require('../controllers/expense');
const authontication= require('../middleware/auth');

router.get('/home',expenseController.expensePage);

router.post('/addExpense',authontication.authenticate,expenseController.addExpense);

router.get('/Expensesheet',authontication.authenticate,expenseController.getExpenses);

router.delete('/deleteexpense/:id',authontication.authenticate,expenseController.deleteExpense);

//router.get('/updateTotalExpense',authontication.authenticate,expenseController.updateTotalExpense);

router.get('/user/download',authontication.authenticate,expenseController.downloadexpense);

module.exports=router;

