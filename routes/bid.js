const express = require('express');
const { body } = require('express-validator');
const bidController = require('../controller/RoomController');
const auction = require('../controller/auction');

const router = express.Router();

const isAuth = require('../middleware/isAuth');

// @route   POST /bid/:adId?amount=<amount>
// @desc    Post a new ad
// @access  protected
router.post('/:adId',isAuth,bidController.addBid);

// @route   GET /bid/:adId?option=<highest>
// @desc    List of bids on an ad
// @access  protected
router.get('/:adId',bidController.listBids);


module.exports = router;
