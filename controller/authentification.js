const db = require('../db/dbConnection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const session = require("express-session");

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const query = 'SELECT id, username, email, phone, address FROM users WHERE id = ?';

    // Use a Promise to wait for the result of the query
    const user = await new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const user = results[0];
          resolve(user);
        }
      });
    });

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    res.render('pages/profile', { user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};


exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const query = 'SELECT id, username, email, password, phone, address FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ errors: [{ msg: 'Server error' }] });
      }

      const user = results[0];
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'no user' }] });
      }

      if (!user.password) {
        return res.status(400).json({ errors: [{ msg: 'no passwd' }] });
      }

      const matched = await bcrypt.compare(password, user.password);

      if (!matched) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }
    

      const payload = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        

      };
      

      

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
        if (err) {
          console.error(err);
          res.status(500).json({ errors: [{ msg: 'Error generating token' }] });
        } else {
          req.session.token=token;
          
          
          res.send('Login successful');
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

/*exports.getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const query = 'SELECT  username, email, phone, address FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ errors: [{ msg: 'Server error' }] });
      }

      const user = results[0];
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'User not found' }] });
      }

      res.status(200).json({ user });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { login, password } = req.body;
    const query = 'SELECT id, username, email, password, phone, address FROM users WHERE email = ?';
    db.query(query, [login], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ errors: [{ msg: 'Server error' }] });
      }

      if (results.length === 0) {
        return res.status(400).json({ errors: [{ msg: 'No user found' }] });
      }

      const user = results[0];

      if (user.password !== password) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
        if (err) {
          console.error(err);
          res.status(500).json({ errors: [{ msg: 'Error generating token' }] });
        } else {
          res.status(200).json({ token });
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
*/
