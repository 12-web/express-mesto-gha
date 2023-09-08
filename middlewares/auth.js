const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../components/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

/**
 * миддлвар проверки токена пользователя
 */
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    /**
     * если запрос пришел с роута '/' без куки, то ответ не возвращает ошибку
     */
    if (req.originalUrl === '/') {
      return res.send(false);
    }

    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) { throw new UnauthorizedError('Token указан неверно'); }

  req.user = payload;
  return next();
};
