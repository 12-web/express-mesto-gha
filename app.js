const express = require('express');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const NotFoundError = require('./components/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('/', require('./routes'));

app.all('*', (req, res, next) => { next(new NotFoundError('Задан неверный путь')); });

app.use(errors());

app.use((err, _, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });

  next();
});

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
