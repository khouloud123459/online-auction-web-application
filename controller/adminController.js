exports.login = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
  
      const { email, password } = req.body;
      const query = 'SELECT id, email, password, FROM admin WHERE email = ?';
      db.query(query, [email], async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ errors: [{ msg: 'Server error' }] });
        }
  
        const admin = results[0];
        if (!admin) {
          return res.status(400).json({ errors: [{ msg: 'no user' }] });
        }
  
        if (!admin.password) {
          return res.status(400).json({ errors: [{ msg: 'no passwd' }] });
        }
  
        if (password !== admin.password) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
          }
 });
      
    } catch (err) {
      console.error(err); 
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  };


exports.inscription = (req, res) => {
    console.log(req.body);
   
    const email = req.body.email;
    
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    db.query('SELECT email FROM admin WHERE email=? ', [email], async (error, results) => {
        
        if (error) {
            console.log(error);
            return res.render('pages/admininscription', {
                message: 'An error occurred while checking the email.'
            });
        }
        if (results.length > 0) {
            return res.render('pages/admininscription', {
                message: 'That email is already in use.'
            });
        } else if (password !== passwordConfirm) {
            return res.render('pages/admininscription', {
                message: 'Passwords do not match.'
            });
        }

        try {
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);
           
        db.query('insert into admin SET ?', {email:email, password:hashedPassword}, (error, results)=>{
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('pages/adminindex', {
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

