const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    userID: String,
    username: String,
    coins: {
        type: Number,
        default: 0
    },
    bank: {
        type: Number,
        default: 0
    },
    bankSpace: {
        type: Number,
        default: 1000
    },
    level: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('Profile', profileSchema);