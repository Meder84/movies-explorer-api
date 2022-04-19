const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  cardValid,
  cardIdValid,
} = require('../middlewares/validations');

router.get('/cards', getCards);

router.post('/cards', cardValid, createCard);

router.delete('/cards/:cardId', cardIdValid, deleteCard);

router.put('/cards/:cardId/likes', cardIdValid, likeCard);

router.delete('/cards/:cardId/likes', cardIdValid, dislikeCard);

module.exports = router;
