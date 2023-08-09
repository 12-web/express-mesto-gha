const Card = require('../models/card');

const SERVER_ERROR = 500;
const NOTFOUND_ERROR = 404;
const VALIDATION_ERROR = 400;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({
          message: `Введен некорректный тип данных (${err.message})`,
        });
      }

      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOTFOUND_ERROR).send({ message: 'Данной карточки не существует' });
      }

      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({
          message: `Введен некорректный тип данных (${err.message})`,
        });
      }

      if (err.name === 'CastError') {
        return res.status(NOTFOUND_ERROR).send({ message: 'Данной карточки не существует' });
      }

      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({
          message: `Введен некорректный тип данных (${err.message})`,
        });
      }

      if (err.name === 'CastError') {
        return res.status(NOTFOUND_ERROR).send({ message: 'Данной карточки не существует' });
      }

      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
