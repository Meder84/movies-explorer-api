const router = require('express').Router();
const {
  createMovie, getMovies, deleteMovie,
} = require('../controllers/movies');

const {
  movieValid, idValid,
} = require('../middlewares/validations');

router.get('/movies', getMovies);
router.post('/movies', movieValid, createMovie);
router.delete('/movies/:_id', idValid, deleteMovie);

module.exports = router;
