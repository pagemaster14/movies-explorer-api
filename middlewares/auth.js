const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../customErrors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError({ message: 'Требуется авторизация' });
  }

  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new UnauthorizedError({ message: 'Требуется авторизация' });
  }
  req.user = payload;
  next();
};
