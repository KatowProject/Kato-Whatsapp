const { Schema, model } = require('mongoose');

const GiveawaySchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    winner: {
        type: Number,
        required: true,
    },
    created: {
        type: Number,
        required: true,
    },
    ended: {
        type: Boolean,
        required: true,
    },
    winner_id: String
});
    
module.exports = model('Giveaway', GiveawaySchema);