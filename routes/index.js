const router = require('express').Router();

const users = require('./users');
const cards = require('./cards');
const { notFoundError } = require('../utils/errors');

router.use('/users', users);
router.use('/cards', cards);
router.all('*', (req, res) => {
  res.status(notFoundError).send({ message: 'Страница не найдена' });
});

module.exports = router;
