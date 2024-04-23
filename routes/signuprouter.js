const express= require('express');
const router= express.Router()

const controllerpage= require('../controllers/user');


router.get('/signup',controllerpage.signupage);

router.post('/signupuser',controllerpage.signupdetails);

router.get('/checkinfo',controllerpage.checkemail)

module.exports=router;