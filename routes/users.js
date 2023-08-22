const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
}), auth, getUsers);

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
    avatar: Joi.string(),
  }),
}), auth, updateAvatar);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

module.exports = router;
