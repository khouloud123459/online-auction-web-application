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
      res.render('pages/AdminRoom', { item: result[0] });
  });
};  