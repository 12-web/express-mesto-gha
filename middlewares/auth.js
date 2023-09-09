const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../components/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

/**
 * миддлвар проверки токена пользователя
 */
module.exports = (req, _, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const YOUR_JWT = token;
  const SECRET_KEY_DEV = 'secret-key';
  try {
    const varifyPayload = jwt.verify(YOUR_JWT, SECRET_KEY_DEV);
    console.log(
      '\x1b[31m%s\x1b[0m',
      `
      Надо исправить. В продакшне используется тот же
      секретный ключ, что и в режиме разработки.
    `,
      varifyPayload,
    );
  } catch (err) {
    if (
      err.name === 'JsonWebTokenError' && err.message === 'invalid signature'
    ) {
      console.log(
        '\x1b[32m%s\x1b[0m',
        'Всё в порядке. Секретные ключи отличаются',
      );
    } else {
      console.log('\x1b[33m%s\x1b[0m', 'Что-то не так', err);
    }
  }

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
    );
  } catch (err) {
    throw new UnauthorizedError('Token указан неверно');
  }

  req.user = payload;
  return next();
};
