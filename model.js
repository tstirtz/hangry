const {DATABASE_URL} = require('./config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);

const restaurantSchema = mongoose.Schema (
    {
        userName: String,
        password: String,
        list: [
            {
                name: String,
                address: String
            }
        ]
    }
);


restaurantSchema.methods.userData = function(){
    return{
        userName: this.userName,
        list: this.list
    }
}
//the first argument is the collection the model is for
const Restaurant = mongoose.model('users', restaurantSchema);

module.exports = {Restaurant};
