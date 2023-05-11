const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createNewUser } = require('../controllers/users');
const { link } = require('../utils/regex');
const users = require('./users');
const cards = require('./cards');
const { notFoundError } = require('../utils/errors');
const { auth } = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(link),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createNewUser);

router.use('/users', auth, users);
router.use('/cards', auth, cards);
router.all('*', (req, res) => {
  res.status(notFoundError).send({ message: 'Страница не найдена' });
});

module.exports = router;
