
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { name } = require('ejs');
const db =require('../db/dbConnection');

exports.inscription = (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const phone= req.body.phone;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    db.query('SELECT email FROM users WHERE email=? ', [email], async (error, results) => {
        
        if (error) {
            console.log(error);
            return res.render('pages/inscription', {
                message: 'An error occurred while checking the email.'
            });
        }
        if (results.length > 0) {
            return res.render('pages/inscription', {
                message: 'That email is already in use.'
            });
        } else if (password !== passwordConfirm) {
            return res.render('pages/inscription', {
                message: 'Passwords do not match.'
            });
        }

        try {
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);
           
        db.query('insert into users SET ?', {email:email, password:hashedPassword, username:username,phone:phone}, (error, results)=>{
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('pages/inscription', {
                  message:'user registred successfully.'
                });
            }

            
           })
        } catch (error) {
            console.error(error);
            return res.render('pages/inscription', {
                message: 'An error occurred while hashing the password.'
            });
        }
    });
};
exports.getUserById = (req, res) => {
    const id = req.params.id;
  
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (queryErr, results) => {
      if (queryErr) {
        console.log(queryErr);
        return res.status(500).json({ errors: [{ msg: 'Database error' }] });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Remove the password field from the user object
      const user = { ...results[0], password: undefined };
      res.status(200).json(user);
    });
  };





exports.purchasedProducts = async (req, res) => {
  const { user } = req;
  try {
    // Assuming you have an 'ads' table with a 'purchasedBy' column
    const query = `
      SELECT *
      FROM ads
      WHERE purchasedBy = ?;
    `;
    
    const [purchasedProducts] = await db.query(query, [user.id]);
    res.status(200).json(purchasedProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

exports.postedProducts = async (req, res) => {
  const { user } = req;
  try {
    // Assuming you have an 'ads' table with an 'owner' column
    const query = `
      SELECT *
      FROM ads
      WHERE owner = ?;
    `;
    
    const [postedAds] = await db.query(query, [user.id]);
    res.status(200).json(postedAds);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
