const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequest');
const NotFound = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');

const createMovie = (req, res, next) => {
  const {
    country, director, duration,
    year, description, image, trailer,
    nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    owner, country, director, duration,
    year, description, image, trailer,
    nameRU, nameEN, thumbnail, movieId,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: err.message }));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};


const deleteMovie = (req, res, next) => {
  const { _id } = req.params;

  Movie.findById(_id)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена!');
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden('Невозможно удалить!');
      }
      return Movie.findByIdAndRemove(_id);
    })
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
}