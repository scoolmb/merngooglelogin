const mongoose = require("mongoose");

const userSchema =  new mongoose.Schema({
    googleID: String,
    displayName: String,
    email: String,
    image: String,
}, {timestamps:true});

const userDb = new mongoose.model('users', userSchema);

module.exports = userDb;