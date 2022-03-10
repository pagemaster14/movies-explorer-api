const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../customErrors/NotFoundError');
const BadRequestError = require('../customErrors/BadRequestError');
const ConflictError = require('../customErrors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с данной почтой уже зарегистрирован');
      } next(err);
    })
    .then((user) => {
      if (!req.user._id) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с данной почтой уже зарегистрирован');
      } next(err);
    })
    .then(() => res.status(201).send({ message: 'Новый пользователь добавлен успешно' }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res
        .send({ token });
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  try {
    res.cookie('jwt', '', {
      maxAge: -1,
      httpOnly: true,
      sameSite: true,
    })
      .send({ message: 'Вы успешно вышли из аккаунта' });
  } catch (err) {
    next(err);
  }
};
