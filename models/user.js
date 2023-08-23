const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../components/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Введен неверный тип email',
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /^https?:\/\/(www\.)?[\w-.~:/?#[\]@!$&'()*+,;=]+$/.test(v);
      },
      message: 'Введен неверный тип ссылки',
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

/**
 * метод проверки почты и пароля пользователя с данными из БД
 * @param { String } email - email пользователя
 * @param { String } password - пароль пользователя
 * @returns { Object } user - объект пользователя с данными
 */
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError('Неверные почта или пароль');
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) throw new UnauthorizedError('Неверные почта или пароль');

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
