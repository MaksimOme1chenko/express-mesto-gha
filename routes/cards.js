const router = require('express').Router();
const {
  getAllCards,
  createNewCard,
  deliteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', createNewCard);
router.delete('/:cardId', deliteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
