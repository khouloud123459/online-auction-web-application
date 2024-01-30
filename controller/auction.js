const { validationResult, Result } = require('express-validator');
const db = require('../db/dbConnection'); // Remplacez par le chemin de votre fichier de connexion MySQL

// @route   POST /auction/start/:adId
// @desc    Start auction
/*exports.startAuction = async (req, res, next) => {
  const adId = req.params.adId; // Corrected to use req.params.adId
  try {
    // Vérifiez si l'utilisateur est le propriétaire de l'annonce
    db.query('SELECT * FROM ads WHERE id = ? ', [adId], async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ errors: [{ msg: 'Server error' }] });
      }

      const ad = result[0];

      if (!ad) {
        return res.status(400).json({ errors: [{ msg: 'Ad not found' }] });
      }

      // Vérifiez l'état de l'enchère
      if (ad.auctionEnded) {
        return res.status(400).json({ errors: [{ msg: 'Auction has already ended' }] });
      }

      if (ad.auctionStarted) {
        return res.status(400).json({ errors: [{ msg: 'Auction has already started' }] });
      }

      // Marquez l'enchère comme commencée
      db.query('UPDATE ads SET auctionStarted = 1 WHERE id = ?', [adId], async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ errors: [{ msg: 'Server error' }] });
        }

        res.status(200).json({ msg: 'Auction started' });

        // Exécutez la minuterie
        const duration = parseInt(ad.duration);
        let timer = parseInt(ad.timer);

        const intervalTimer = setInterval(async () => {
          timer -= 1;
          await db.query('UPDATE ads SET timer = ? WHERE id = ?', [timer, adId]);
        }, 1000);

        setTimeout(async () => {
          clearInterval(intervalTimer);

          // Mettez à jour l'annonce pour indiquer que l'enchère est terminée
          await db.query('UPDATE ads SET auctionEnded = 1, timer = 0 WHERE id = ?', [adId]);

          // Vérifiez s'il y a un enchérisseur actuel
          const [auctionEndAd] = await db.query('SELECT * FROM ads WHERE id = ?', [adId]);

          if (auctionEndAd.currentBidder) {
            // L'annonce est vendue
            auctionEndAd.purchasedBy = auctionEndAd.currentBidder;
            auctionEndAd.sold = true;

            // Enregistrez les modifications dans la base de données
            await db.query('UPDATE ads SET purchasedBy = ?, sold = 1 WHERE id = ?', [auctionEndAd.currentBidder, adId]);

            // Ajoutez le produit au gagnant
            const [winner] = await db.query('SELECT * FROM users WHERE id = ?', [auctionEndAd.currentBidder]);

            // Handle winner logic here...

          } else {
            // Handle logic if there is no current bidder
          }
        }, (duration + 1) * 1000);
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
*/
exports.startAuction = async (req, res, next) => {
  const adId = req.params.adId;
  const user= req.user.id; // Corrected to use req.params.adId
  try {
    // Vérifiez si l'utilisateur est le propriétaire de l'annonce
    db.query('SELECT * FROM ads WHERE id = ? ', [adId], async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ errors: [{ msg: 'Server error' }] });
      }

      const ad = result[0];

      if (!ad) {
        return res.status(400).json({ errors: [{ msg: 'Ad not found' }] });
      }

      // Vérifiez l'état de l'enchère
      if (ad.auctionEnded) {
        return res.status(400).json({ errors: [{ msg: 'Auction has already ended' }] });
      }

      if (ad.auctionStarted) {
        return res.status(400).json({ errors: [{ msg: 'Auction has already started' }] });
      }

      // Marquez l'enchère comme commencée
      db.query('UPDATE ads SET auctionStarted = 1 WHERE id = ?', [adId], async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ errors: [{ msg: 'Server error' }] });
        }

        // Exécutez la minuterie
        const duration = parseInt(ad.duration);
        let timer = parseInt(ad.timer);

        const intervalTimer = setInterval(async () => {
          timer -= 1;
          db.query('UPDATE ads SET timer = ? WHERE id = ?', [timer, adId]);
        }, 1000);

        setTimeout(async () => {
          clearInterval(intervalTimer);

          // Mettez à jour l'annonce pour indiquer que l'enchère est terminée
          db.query('UPDATE ads SET auctionEnded = ?, timer = 0 WHERE id = ?', [1, adId]);

          // Vérifiez s'il y a un enchérisseur actuel
          const [auctionEndAd] = db.query('SELECT * FROM ads WHERE id = ?', [adId]);

          if (auctionEndAd.currentBidder) {
            // L'annonce est vendue
            auctionEndAd.purchasedBy = auctionEndAd.currentBidder;
            auctionEndAd.sold = 1;

            // Enregistrez les modifications dans la base de données
            db.query('UPDATE ads SET purchasedBy = ?, sold = ? WHERE id = ?', [auctionEndAd.currentBidder, 1, adId]);

            // Ajoutez le produit au gagnant
           

           
            // Update the message in the response object
            res.auctionMessage = 'Auction started successfully.';

            // Render the EJS template
            res.render('your_ejs_template', { /* other variables */ });
          } else {
            // Update the message in the response object
            res.auctionMessage = 'Auction started successfully.';

            // Render the EJS template
            res.render('pages/AdminRoom', { item: result[0] });
          }
        }, (duration + 1) * 1000);
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
