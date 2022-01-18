const Movie = require('../models/movie');
const NotFoundError = require('../customErrors/NotFoundError');
const BadRequestError = require('../customErrors/BadRequestError');
const ForbiddenError = require('../customErrors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movieData) => {
      if (!movieData) {
        throw new NotFoundError({ message: 'Карточка с указанным _id не найдена' });
      }
      if (movieData.owner._id.toString() === req.user._id) {
        Movie.findByIdAndDelete(req.params.movieId)
          .then(() => {
            res.send({ message: 'Карточка удалена' });
          });
      } else {
        throw new ForbiddenError({ message: 'Недостаточно прав для удаления' });
      }
    })
    .catch(next);
};
