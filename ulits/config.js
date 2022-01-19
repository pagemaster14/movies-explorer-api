require('dotenv').config();

const {
  MONGO_DB_ADDRESS,
  NODE_ENV,
} = process.env;

module.exports = {
  MONGO_DB_ADDRESS: NODE_ENV === 'production' ? MONGO_DB_ADDRESS : 'mongodb://localhost:27017/moviesdb',
};
