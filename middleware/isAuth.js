const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const Storedtoken = req.session.token;
  // If no token
  if (!Storedtoken) {
    return res.status(401).json({ errors: [{ msg: 'Invalid token, not logged in' }] });
  }
  // Verify token
  try {
    const verifiedToken = jwt.verify(Storedtoken, process.env.JWT_SECRET);
    req.user = verifiedToken.user;
    next();
  } catch (err) {
     return res.status(401).json({ errors: [{ msg: 'Invalid token' }] });
  }
};