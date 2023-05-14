const mongoose = require('mongoose');
const Cards = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getAllCards = (req, res, next) => {
  Cards.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const createNewCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequestError('Переданы некорректные данные для создания карточки');
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      if (!card.owner.equals(owner)) {
        throw new ForbiddenError('У вас нет прав удалить эту карточку');
      }
      return Cards.findByIdAndRemove(req.params.cardId)
        .then((Card) => res.send({ data: Card }));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Переданы некорректные данные.');
      } else {
        next(err);
      }
    });
};

const changeLikeStatus = (req, res, updateData, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) res.send(card);
      else {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Переданы некорректные данные для постановки/снятия лайка.');
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const changeData = { $addToSet: { likes: req.user._id } };
  changeLikeStatus(req, res, changeData, next);
};

const dislikeCard = (req, res, next) => {
  const updateData = { $pull: { likes: req.user._id } };
  changeLikeStatus(req, res, updateData, next);
};

module.exports = {
  getAllCards,
  createNewCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
