/* eslint-disable no-console */
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGOURI = process.env.MONGODB_URI;

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(passport.initialize());
const passportMiddleware = require('./middleware/passport');

passport.use(passportMiddleware);

// this is the base url
app.get('/', (req, res) => {
  return res.send('Hello the API is at http://localhost:/api');
});
// set routes variable
const routes = require('./routes');

app.use('/api', routes);

// set mongo config
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
// set connection
const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB connection open.');
});
// error if no connection is established
connection.on('error', () => {
  console.log('Connection error. Please make sure mongo is running.');
});

// set app port to variable defined earlier
app.listen(PORT);

console.log('The API is up and running!');