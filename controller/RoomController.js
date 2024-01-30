const db = require('../db/dbConnection');
const path = require('path');


exports.getProductDetails = (req, res) => {
  const productId = req.params.id; // Change "productId" to "id"

  // Fetch product details from the database based on productId
  db.query('SELECT * FROM ads WHERE id = ?', [productId], (err, result) => {
      if (err) {
          console.error('Error fetching product details:', err);
          return res.status(500).send('Internal Server Error');
          
      }

console.log('Product details:', result[0]); // Log the product details
      // Render the Room.ejs page with product details
      res.render('pages/Room', { item: result[0] });
  });
};  
exports.addBid = async (req, res, next) => {
  const adId  = req.params.adId;
  const user=req.user.id;
  const { bidAmount } = req.body; // Change from req.query to req.body
  console.log(bidAmount)

  try {
    // Execute the SQL query to retrieve the ad
    db.query('SELECT * FROM ads WHERE id = ?', [adId], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ errors: [{ msg: 'Server error' }] });
      }

      // Check if the ad is not found
      const ad = results[0];
      if (!ad) {
        return res.status(404).json({ errors: [{ msg: 'Ad not found' }] });
      }

      // Check bid conditions
      if (parseFloat(ad.currentPrice) >= parseFloat(bidAmount)) {
        return res.status(400).json({ errors: [{ msg: 'Bid amount less than existing price' }] });
      }

      if (ad.sold || ad.auctionEnded || !ad.auctionStarted) {
        return res.status(400).json({ errors: [{ msg: 'Auction has ended or has not started' }] });
      }

      // Update the ad with the new bid
      await db.query('INSERT INTO bids (adId, amount) VALUES (?, ?)', [adId, bidAmount]);
      await db.query('UPDATE ads SET currentPrice = ? WHERE id = ?', [bidAmount, adId]);
      var item;

      //res.status(200).json({ success: true });
      res.render("pages/Room",{ item: results[0] });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
// GET /bid/:adId?option=<highest>
/*exports.listBids = async (req, res, next) => {
 const adId=req.params.adId;
  try {
    // Exécutez votre requête SQL pour récupérer les enchères de l'annonce
    db.query('SELECT * FROM bids WHERE adId = ?', [adId], (err, result) => {
      if (err) {
        console.error('Error fetching bids details:', err);
        return res.status(500).json({ errors: [{ msg: 'Internal Server Error' }] });
      }

      console.log('bids details:', result); // Log the bid details

      if (result.length === 0) {
        return res.status(404).json({ errors: [{ msg: 'Ad not found' }] });
      }

      const bidList = result;

      const response = (option.toString() === 'highest') ? [bidList[bidList.length - 1]] : bidList;

      res.status(200).json(response);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};*/
exports.listBids = async (req, res, next) => {
  const adId = req.params.adId;

  console.log('Received adId:', adId);
  const option = req.query.option || 'default'; // Extract option from req.query

  try {
    // Execute your SQL query to retrieve the bids for the ad
    db.query('SELECT * FROM bids WHERE adId = ?', [adId], (err, result) => {

      if (err) {
        console.error('Error fetching bids details:', err);
        return res.status(500).json({ errors: [{ msg: 'Internal Server Error' }] });
      }

      console.log('bids details:', result); // Log the bid details

      if (result.length === 0) {
        return res.status(404).json({ errors: [{ msg: 'no bids yet' }] });
      }

      const bidList = result;

      const response = (option.toString() === 'highest') ? [bidList[bidList.length - 1]] : bidList;

      
      res.render('pages/BidsList', { bidList: bidList });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

