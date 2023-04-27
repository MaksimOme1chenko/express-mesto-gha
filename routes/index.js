const router = require('express').Router();

const users = require('./users');
const cards = require('./cards');

router.use('/users', users);
router.use('/cards', cards);
router.all('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
