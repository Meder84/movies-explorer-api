require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const cors = require('cors');
const { NOT_FOUND } = require('./config/constants');
const errorHandler = require('./middlewares/errorHandler');
const { createUser, login } = require('./controllers/users');
const { registerValid, loginValid } = require('./middlewares/validations');
const auth = require('./middlewares/auth');

const { PORT = 3001 } = process.env;
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(cookieParser());
app.use(requestLogger); // Логгер запросов нужно подключить до всех обработчиков роутов:

app.use(cors());
app.get('/crash-test', () => { // Надо удалить этот код после успешного прохождения ревью.
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signup', registerValid, createUser);
app.post('/signin', loginValid, login);

app.use(auth);

app.use('/', require('./routes/cards'));
app.use('/', require('./routes/users'));

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена!' });
});

app.use(errorLogger); // нужно подключить после обработчиков роутов и до обработчиков ошибок:
app.use(errorHandler);
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
