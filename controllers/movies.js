const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequest');
const NotFound = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');

const createMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.body.movieId })
    .then((movie) => {
      if (movie) {
        throw new Forbidden('Такой фильм уже добавлен в избранное');
      }
      return Movie.create({
        ...req.body,
        owner: req.user._id,
      });
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: err.message }));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(() => new NotFound('Нет фильмов в избранном.'))
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;

  Movie.findById(_id)
    .orFail(() => {
      throw new NotFound('Фильм с указанным _id не найден!');
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden('Невозможно удалить!');
      }
      return movie.remove().then(() => res.send({ message: movie }));
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
