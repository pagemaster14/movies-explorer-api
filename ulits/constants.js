const MONGO_DB_ADDRESS = 'mongodb://localhost:27017/moviesdb';

const ALLOWED_CORS = [
  'http://lovchevmesto.nomoredomains.rocks',
  'https://lovchevmesto.nomoredomains.rocks',
  'http://localhost:3000',
];

module.exports = {
  MONGO_DB_ADDRESS,
  ALLOWED_CORS,
};
