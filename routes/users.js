const usersRouter = require('express').Router();
const {
  validateId,
  validateUpdateUser,
} = require('../middlewares/requestValidation');

const {
  updateUser,
  getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/users/me', validateId, getCurrentUser);
usersRouter.patch('/users/me', validateUpdateUser, updateUser);

module.exports = usersRouter;
