const db = require('../db/dbConnection');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Set the destination folder for uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.addAd = async (req, res, next) => {
  // Use upload.single middleware to handle file upload
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ errors: [{ msg: 'File upload error' }] });
    }

    // Check if req.file exists before accessing its properties
    const image = req.file ? req.file.path : '';

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    let { productName,description, basePrice, duration, category,status,highlights } = req.body;
    const owner=req.user.id;
    

    if (!duration || duration === 0) duration = 300;
    if (duration > 10800) duration = 3600;

    const values = [productName,description,basePrice, duration, image, category,status,highlights,owner];
    const sql = 'INSERT INTO ads (productName,description,basePrice, duration, image, category,status,highlights,owner) VALUES (?,?,?,?,?,?,?,?,?)';

    db.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error inserting into the database:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Inserted into the database:', results);

      // Redirect to the index page after successful upload
      res.redirect('/'); // Change '/index' to the actual route you want to redirect to
    });
  });
};
exports.deleteProduct = (req, res) => {
  const productId = req.params.adId;

  // Perform the deletion in the database
  db.query('DELETE FROM ads WHERE id = ?', [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ errors: [{ msg: 'Internal Server Error' }] });
    }

    // Check if any rows were affected (product was found and deleted)
    if (result.affectedRows === 0) {
      return res.status(404).json({ errors: [{ msg: 'Product not found' }] });
    }

    // Fetch the updated list of products after deletion
    db.query('SELECT * FROM ads', (err, updatedResult) => {
      if (err) {
        console.error('Error fetching updated products:', err);
        return res.status(500).json({ errors: [{ msg: 'Internal Server Error' }] });
      }

      // Respond with the updated list of products or any other relevant response
      res.render('pages/admin',{ result: updatedResult });
    });
  });
};

