const mongoose = require('mongoose')

const Schema = mongoose.Schema

const timeRangeSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    serviceLevel: {
        type: String,
        required: true,
        // maxlength: 1 // If we switch to chars put this code back in
    }
});

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    setupComplete: {
        type: Boolean,
        required: true
    },

    timeRanges: [timeRangeSchema]
});

module.exports = mongoose.model('User', userSchema)