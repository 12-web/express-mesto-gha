const express = require('express');
const mongoose = require('mongoose');
const { NOTFOUND_ERROR } = require('./utils/utils');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64d25f2f4f45988fbd66ee41',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(NOTFOUND_ERROR).send({ message: 'Задан неверный путь' });
});

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
