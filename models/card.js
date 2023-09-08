const mongoose = require('mongoose');
const linkRegex = require('../utils/utils');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return linkRegex.test(v);
      },
      message: 'Введен неверный тип ссылки',
    },
  },
  owner: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  likes: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
