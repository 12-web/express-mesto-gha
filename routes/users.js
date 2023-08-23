const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', auth, getUsers);

router.get('/me', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
}), auth, getCurrentUser);

router.get('/:userId', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), auth, getUser);

router.patch('/me', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), auth, updateProfile);

router.patch('/me/avatar', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[\w-.~:/?#[\]@!$&'()*+,;=]+$/),
  }),
}), auth, updateAvatar);

module.exports = router;
