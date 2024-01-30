const express = require('express');
const router = express.Router();
const searchController = require('../controller/search');


router.get('/', searchController.search);

router.post('/', searchController.searchtitle);

module.exports = router;