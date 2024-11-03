const { Schema, model } = require('mongoose');

const promptSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    primaryColor: {
        type: String,
    },
    secondaryColor: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Prompt = model('Prompt', promptSchema);

module.exports = Prompt;