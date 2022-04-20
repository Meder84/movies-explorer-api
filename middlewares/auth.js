const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = () => {
  throw new Unauthorized('Необходима авторизация');
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'jwt_secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
