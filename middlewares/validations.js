const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { regexLink } = require('../config/constants');

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
    email: Joi.string().required().custom((value, helper) => { // custom - Добавляет пользовательскую функцию
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
    image: Joi.string().required().pattern(regexLink), // pattern- шаблон,  который может быть либо регулярным выражением, либо схемой joi
    trailerLink: Joi.string().required().pattern(regexLink),
    thumbnail: Joi.string().required().pattern(regexLink),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const idValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  registerValid,
  loginValid,
  userUbdateValid,
  movieValid,
  idValid,
};