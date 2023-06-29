/* eslint-disable linebreak-style */
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

function urlValid(url) {
  const resultUrlValid = validator.isURL(url);
  if (!resultUrlValid) {
    throw new Error('url некорректный!');
  }
  return url;
}

const registerValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (!validator.isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }).messages({
      'any.required': 'Email не указан',
      'string.notEmail': 'Email некорректный',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Пароль не указан',
      'string.min': 'Пароль должен быть больше 8и символов',
    }),
    name: Joi.string().required().min(2).max(30),
  }),
});

const loginValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (!validator.isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }).messages({
      'any.required': 'Email не указан',
      'string.notEmail': 'Email некорректный',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Пароль не указан',
      'string.min': 'Пароль должен быть больше 8и символов',
    }),
  }),
});

const userUbdateValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const movieValid = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().pattern(/\d{4}/),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValid),
    trailerLink: Joi.string().required().custom(urlValid),
    thumbnail: Joi.string().required().custom(urlValid),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const idValid = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  registerValid,
  loginValid,
  userUbdateValid,
  movieValid,
  idValid,
};
