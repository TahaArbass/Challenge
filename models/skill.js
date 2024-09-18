// a skill schema nested inside the player schema
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const skillSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    skill: {
        type: String,
        enum: ['defense', 'speed', 'strength', 'stamina', 'attack'],
        required: true,
    },
    value: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    playerId: {
        type: Number,
        ref: 'Player',
    }
}, { _id: false });

// Add an auto-incrementing field to the schema
skillSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'skill_counter' });

module.exports = skillSchema;