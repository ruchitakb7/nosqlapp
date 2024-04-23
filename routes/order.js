const express= require('express')
const router = express.Router();

const orderController = require('../controllers/order');
const authenticatemiddleware = require('../middleware/auth');


router.get('/purchase/premiummembership',authenticatemiddleware.authenticate, orderController.purchasepremium);

router.post('/purchase/updatetransactionstatus',authenticatemiddleware.authenticate, orderController.updateTransactionStatus);


module.exports=router;