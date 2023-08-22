const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
}), auth, getCards);

router.post('/', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), auth, createCard);

router.delete('/:cardId', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), auth, deleteCard);

router.put('/:cardId/likes', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), auth, likeCard);

router.delete('/:cardId/likes', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), auth, dislikeCard);

module.exports = router;
