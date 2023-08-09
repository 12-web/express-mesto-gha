const User = require('../models/user');

const SERVER_ERROR = 500;
const NOTFOUND_ERROR = 404;
const VALIDATION_ERROR = 400;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(NOTFOUND_ERROR)
          .send({ message: 'Данного пользователя не существует' });
      }

      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({
          message: `Введен некорректный тип данных (${err.message})`,
        });
      }

      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({
          message: `Введен некорректный тип данных (${err.message})`,
        });
      }

      if (err.name === 'CastError') {
        return res
          .status(NOTFOUND_ERROR)
          .send({ message: 'Данного пользователя не существует' });
      }

      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({
          message: `Введен некорректный тип данных (${err.message})`,
        });
      }

      if (err.name === 'CastError') {
        return res
          .status(NOTFOUND_ERROR)
          .send({ message: 'Данного пользователя не существует' });
      }

      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
