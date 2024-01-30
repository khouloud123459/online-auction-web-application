const express = require('express');
const { body } = require('express-validator');

const authController = require('../controller/authentification');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// @route   POST /auth
// @desc    Login with credentials
// @access  public
router.post(
  '/',
 
  authController.login
);

// @route   GET /auth
// @desc    Get logged in user from token
// @access  protected
router.get('/', isAuth, authController.getUser);

module.exports = router;
