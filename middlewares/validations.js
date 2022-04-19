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
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexLink),
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
    about: Joi.string().required().min(2).max(30),
  }),
});

const userValidId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const avatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regexLink),
  }),
});

const cardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regexLink),
  }),
});

const cardIdValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  registerValid,
  loginValid,
  userValidId,
  userUbdateValid,
  cardValid,
  cardIdValid,
  avatarValid,
};
