const Move = require('../models/movie');
const BadRequestError = require('../errors/BadRequest');
const NotFound = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');
const movie = require('../models/movie');

const createMovie = (req, res, next) => {
  const {
    country, director, duration,
    year, description, image, trailer,
    nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Move.create({
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
  Move.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};


const deleteMovie = (req, res, next) => {
  const { _id } = req.params;

  Move.findById(_id)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена!');
    })
    .then((movie) => {
      if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
        throw new Forbidden('Невозможно удалить!');
      }
      return Move.findByIdAndRemove(_id);
    })
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
}