const Card = require('../models/card');
const NotFoundError = require('../components/NotFoundError');
const BadRequestError = require('../components/BadRequestError');
const ForbiddenError = require('../components/ForbiddenError');

/**
 * полечение карточек из БД
 */
module.exports.getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

/**
 * создание карточки
 */
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else next(err);
    });
};

/**
 * удаление карточки
 */
module.exports.deleteCard = (req, res, next) => {
  Card.findOne({
    _id: req.params.cardId,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточки с введенным _id не существует');
      }

      /**
       * проверка прав удаления карточки текущим пользователем
       * удалить карточку может только пользователь, создавший карточку
       */
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('У данного пользователя нет прав для удаления карточки');
      }

      /**
       * удаление карточки и возвращение пользователю сообщения со статусом
       */
      return Card.deleteOne({ _id: req.params.cardId }).then(() => res.send({ message: 'карточка успешно удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введен некорректный тип данных (_id)'));
      } else next(err);
    });
};

/**
 * установление лайка карточки
 */
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточки с введенным _id не существует');
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Введен некорректный тип данных (_id)'));
      } else next(err);
    });
};

/**
 * удаление лайка карточки
 */
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточки с введенным _id не существует');
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Введен некорректный тип данных (_id)'));
      } else next(err);
    });
};
