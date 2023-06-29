/* eslint-disable linebreak-style */
const router = require('express').Router();
const { getUsersMe, updateUser } = require('../controllers/users');

const { userUbdateValid } = require('../middlewares/validations');

router.get('/users/me', getUsersMe);
router.patch('/users/me', userUbdateValid, updateUser);

module.exports = router;
