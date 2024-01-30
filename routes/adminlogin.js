const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');



const { body } = require('express-validator');
const adminlogin = require('../controller/adminController');









router.post('/',adminlogin.login);
module.exports = router;
