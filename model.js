const {DATABASE_URL} = require('./config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);
