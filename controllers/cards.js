const mongoose = require('mongoose');
const Cards = require('../models/card');

const getAllCards = (req, res) => {
  Cards.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch((error) => res.status(500).send(error));
};

const createNewCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const deliteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Передан несуществующий id карточки.' });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Передан некорректный id.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const changeLikeStatus = (req, res, updateData) => {
  Cards.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Передан несуществующий id карточки.' });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  const changeData = { $addToSet: { likes: req.user._id } };
  changeLikeStatus(req, res, changeData);
};

const dislikeCard = (req, res) => {
  const updateData = { $pull: { likes: req.user._id } };
  changeLikeStatus(req, res, updateData);
};

module.exports = {
  getAllCards,
  createNewCard,
  deliteCard,
  likeCard,
  dislikeCard,
};
