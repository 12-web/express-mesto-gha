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
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) { throw new UnauthorizedError('Token указан неверно'); }

  req.user = payload;
  return next();
};
