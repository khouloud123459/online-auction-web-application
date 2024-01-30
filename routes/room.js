const express = require('express');
const router = express.Router();
const roomController = require('../controller/RoomController');
const adminController = require('../controller/adminRoom');
const auction = require('../controller/auction');
const adsController=require('../controller/AdsController');
const isAuth = require('../middleware/isAuth');
router.get('/:id', roomController.getProductDetails);
router.get('/admin/:id',adminController.getProductDetails);
router.post('/auction/:adId',isAuth,auction.startAuction);
router.get('/bids/:adId',roomController.listBids);
router.post('/product/:adId',adsController.deleteProduct);

module.exports = router;