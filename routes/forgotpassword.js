const express= require('express')

const router = express.Router()

const forgotpasswordContoller= require('../controllers/forgotpassword');

router.get('/forgotpassword',forgotpasswordContoller.forgotpasswordForm)

router.post('/forgotpassword/password',forgotpasswordContoller.forgotpassword)

router.get('/password/resetpassword/:id',forgotpasswordContoller.resetpassword);

router.get('/password/updatepassword/:id',forgotpasswordContoller.updatepassword)


module.exports=router