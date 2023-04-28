const mongoose = require('mongoose');
const User = require('../models/user');
const { notFoundError, badRequestError, internalServerError } = require('../utils/errors');

const getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(internalServerError).send({ message: 'Произошла ошибка' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(notFoundError).send({ message: 'Пользователь с таким id не найден.' });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(badRequestError).send({ message: 'Передан некорректный id пользователя' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

const createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

const changeUserData = (req, res, updateData) => {
  User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(notFoundError).send({ message: 'Пользователь с таким id не найден.' });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const updateData = req.body;
  changeUserData(req, res, updateData);
};

const updateAvatar = (req, res) => {
  const updateData = req.body;
  changeUserData(req, res, updateData);
};

module.exports = {
  getAllUsers,
  createNewUser,
  getUserById,
  updateUser,
  updateAvatar,
};
