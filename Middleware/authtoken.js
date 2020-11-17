const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;

    if (typeof bearerHeader !== 'undefined') {
      const token = bearerHeader.split(' ')[1];
      req.data = jwt.verify(token, 'Project400-Jwt-Secret');
      next();
    } else {
      return res.status(401).json({ msg: 'Authentication Failed' });
    }
  } catch (error) {
    return res.status(401).json({ msg: 'Authentication Failed' });
  }
};