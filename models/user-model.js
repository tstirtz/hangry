const {DATABASE_URL} = require('../config');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);

let restaurantSchema = mongoose.Schema(
    {
        name: String,
        address: String
    }
);


let userSchema = mongoose.Schema (
    {
        userName: String,
        password: String,
        restaurants: [restaurantSchema]
        //this embeds the restaurant document within the User document
    }
);




userSchema.methods.userData = function(){
    return{
        userName: this.userName,
        restaurants: this.restaurants,
        _id: this._id
    }
}

userSchema.methods.forAuthToken = function(){
    return {
        userName: this.userName,
        _id: this._id
    }
}

userSchema.methods.validatePassword = function(password){
    return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password){
    return bcrypt.hash(password, 10);
}
//the first argument is the collection the model is for
let Users = mongoose.model('User', userSchema);

module.exports = {Users};
