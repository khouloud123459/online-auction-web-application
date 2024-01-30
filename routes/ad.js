// ad.js
const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');



const { body } = require('express-validator');
const adController = require('../controller/AdsController');









router.post('/',isAuth,adController.addAd);
module.exports = router;
