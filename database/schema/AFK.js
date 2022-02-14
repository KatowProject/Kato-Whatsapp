const { Schema, model } = require('mongoose');

const afkSchema = new Schema({
    userID: String,
    data: {
        now: Number,
        reason: String,
    }
});

module.exports = model('AFK', afkSchema);