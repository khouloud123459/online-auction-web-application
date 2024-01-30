
const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');



const { body } = require('express-validator');
const inscription = require('../controller/inscription');










router.post('/', inscription.inscription);
router.get('/:id', isAuth, inscription.getUserById);

// @route   GET /user/purchased
// @desc    Get products purchased by user
// @access  protected
router.get('/products/purchased', isAuth, inscription.purchasedProducts);

// @route   GET /user/posted
// @desc    Get product ads posted by user
// @access  protected
router.get('/products/posted', isAuth, inscription.postedProducts);

module.exports = router;


module.exports = router;
