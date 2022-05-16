const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFoundError');
const ErrorConflict = require('../errors/ErrorConflict');
const BadRequestError = require('../errors/BadRequest');
const { SALT_ROUNDS } = require('../config/constants');
const { JWT } = require('../config/constants');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ // вернём записанные в базу данные
      name, email, password: hash,
    })
      .then((user) => {
        const newUser = user.toObject();
        delete newUser.password;
        res.send(newUser);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError({ message: err.message });
        }
        if (err.code === 11000) {
          throw new ErrorConflict(`Пользователь ${email} уже зарегистрирован`);
        }
        return next(err);
      }))
    .catch(next);
};

const getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound('Пользователь с таким id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate( // найти первое совпадение с полем user._id
    // Есть тонкость в работе методов обновления: по умолчанию параметр,
    // который получает на вход обработчик then — это документ до обновления:
    req.user._id, // user здесь — это документ до обновления
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден!');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: err.message }));
      }
      if (err.code === 11000) {
        next(new ErrorConflict(`Пользователь ${email} уже зарегистрирован`));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT,
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ message: 'Авторизация прошла успешно!' });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Деавторизация прошла успешно!' });
};

module.exports = {
  createUser,
  updateUser,
  getUsersMe,
  login,
  logout,
};
