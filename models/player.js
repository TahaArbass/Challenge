const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const skillSchema = require('./skill');

const playerSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        enum: ['defender', 'midfielder', 'forward'],
        required: true,
    },
    playerSkills: [skillSchema]
});

// adding auto increment to the player schema
playerSchema.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('Player', playerSchema);