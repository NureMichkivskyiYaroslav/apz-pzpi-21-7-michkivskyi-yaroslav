const mongoose = require('mongoose');

const temperatureIndicatorSchema = new mongoose.Schema({
    clientSessionID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ClientSession' },
    dateTime: { type: Date, required: true},
    temperature: { type: Number, required: true},
});

const GeneralCounterIndicator = mongoose.model('GeneralCounterIndicator', generalCounterIndicatorSchema);

module.exports = GeneralCounterIndicator;
