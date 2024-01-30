const express = require('express');
const { body } = require('express-validator');

const authController = require('../controller/authentification');
const isAuth = require('../middleware/isAuth');

const router = express.Router();


router.get('/',isAuth, authController.getUser);

module.exports = router;
