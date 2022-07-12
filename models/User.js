const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true
    },

    date : {
        type : String,
        default: Date.now
    }
})
const User = mongoose.model('User', userSchema);
User.createIndexes()

module.exports = User
