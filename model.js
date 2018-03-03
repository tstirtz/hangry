const {DATABASE_URL} = require('./config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);

const restaurantSchema = mongoose.Schema ({
    userName: String,
    password: String,
    list: [
        {
            name: String,
            address: String
        }
    ]

});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = {Restaurant};
