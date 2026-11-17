
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    status: {
        type: String,
        enum: ['Applied', 'Interview', 'Selected', 'Rejected'],
        default: 'Applied'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);
