const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFoundError');
const ErrorConflict = require('../errors/ErrorConflict');
const BadRequestError = require('../errors/BadRequest');
const { SALT_ROUNDS } = require('../config/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict(`Пользователь ${email} уже зарегистрирован`);
      }
      return bcrypt.hash(password, SALT_ROUNDS);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(200).send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: err.message }));
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
        NODE_ENV === 'production' ? JWT_SECRET : 'jwt_secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден!');
    })
    .then((user) => res.send({ data: user }))
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
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден!');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: err.message }));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден!');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: err.message }));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
  getUsersMe,
};
