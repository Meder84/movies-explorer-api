const { Schema, model } = require('mongoose');
const { regexLink } = require('../config/constants');

const movieSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
      type: String,
    required: true,
    validate: {
      validator(link) {
        return regexLink.test(link);
      },
      message: 'Некорректная ссылка!',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return regexLink.test(link);
      },
      message: 'Некорректная ссылка!',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return regexLink.test(link);
      },
      message: 'Некорректная ссылка!',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',  // В это свойство записывают имя модели, на которую мы ссылаемся:
    required: true,
  },
  movieId: {
    type: Number,
    ref: 'movie',
    required: true,
    unique: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = model('movie', movieSchema);