const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../components/UnauthorizedError');

/**
 * миддлвар проверки токена пользователя
 */
module.exports = (req, _, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(token, 'f8291a7e588cad8d7a8638c0a998ad9b095b7e27db1e6a14faf2d701b82f7ba5');
  } catch (err) { throw new UnauthorizedError('Token указан неверно'); }

  req.user = payload;
  return next();
};
