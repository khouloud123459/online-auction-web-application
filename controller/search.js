const db = require('../db/dbConnection');


exports.search = async (req, res, next) => {
    try {
      
      const category = req.query.category;
  
      // Use parameterized queries to prevent SQL injection
      const sql = 'SELECT * FROM ads WHERE category = ? ';
      
      // Execute the query
      db.query(sql, [category], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Server error' });
        }
  
        // Return the search results
        res.render('pages/search',{result:results});
       // res.json(results);
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  exports.searchtitle = async (req, res, next) => {
    try {
      
      const title = req.body.title;
  
      // Use parameterized queries to prevent SQL injection
      const sql = 'SELECT * FROM ads WHERE productName like ? ';
      
      // Execute the query
      db.query(sql, [title], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Server error' });
        }
  
        // Return the search results
        res.render('pages/search',{result:results});
       // res.json(results);
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  