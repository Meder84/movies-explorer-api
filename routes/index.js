const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { registerValid, loginValid } = require('../middlewares/validations');
const auth = require('../middlewares/auth');
const { NOT_FOUND } = require('../config/constants');

router.post('/signup', registerValid, createUser);
router.post('/signin', loginValid, login);
// router.post('/signout', logout);

router.use(auth);

router.use('/', require('./movies'));
router.use('/', require('./users'));

router.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена!' });
});

module.exports = router;
