/* eslint-disable linebreak-style */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('./middlewares/limiter');

const router = require('./routes/index');

const errorHandler = require('./middlewares/errorHandler');

const { PORT, DATA_BASE } = require('./config/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DATA_BASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.use(helmet());
app.use(cookieParser());
app.use(requestLogger); // Логгер запросов нужно подключить до всех обработчиков роутов:

app.use(cors());

app.use(limiter);
app.use(router);
app.use(errorLogger); // нужно подключить после обработчиков роутов и до обработчиков ошибок:
app.use(errorHandler);
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
