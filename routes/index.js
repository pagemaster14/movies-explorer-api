const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../customErrors/NotFoundError');
const {
  validateSignIn,
  validateSignUp,
} = require('../middlewares/requestValidation');
const {
  login,
  createUser,
  logout,
} = require('../controllers/users');

router.post('/signin', validateSignIn, login);
router.post('/signup', validateSignUp, createUser);
router.use('/', auth, usersRouter);
router.use('/', auth, moviesRouter);
router.use('/signout', logout);
router.use(() => {
  throw new NotFoundError('Ресурс не найден');
});

module.exports = router;
