const db = require('../db/dbConnection');

// POST /bid/:adId
// POST /bid/:adId
exports.addBid = async (req, res, next) => {
  const adId  = req.params.adId;
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
      await db.query('INSERT INTO bids (adId, amount) VALUES (?,?)', [adId, bidAmount]);
      await db.query('UPDATE ads SET currentPrice =? WHERE id =?', [bidAmount, adId]);
      var item;

      //res.status(200).json({ success: true });
      res.render("pages/Room",{result:results},{item:item});
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
// GET /bid/:adId?option=<highest>
/*exports.listBids = async ({ params: { adId }, query: { option = 'default' } }, res) => {
  try {
    // Exécutez votre requête SQL pour récupérer les enchères de l'annonce
    const [bids] = await db.execute('SELECT * FROM bid WHERE adId = ?', [adId]);

    if (bids.length === 0) {
      return res.status(404).json({ errors: [{ msg: 'Ad not found' }] });
    }

    const bidList = bids;

    const response = (option.toString() === 'highest') ? [bidList[bidList.length - 1]] : bidList;

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};*/
