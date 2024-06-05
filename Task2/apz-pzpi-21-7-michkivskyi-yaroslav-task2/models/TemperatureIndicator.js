const mongoose = require('mongoose');

const temperatureIndicatorSchema = new mongoose.Schema({
    tripCaseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'TripCase' },
    caseId:{type: String, required: true },
    dateTime: { type: Date, required: true},
    temperature: { type: Number, required: true},
});

const TemperatureIndicator = mongoose.model('TemperatureIndicator', temperatureIndicatorSchema);

module.exports = TemperatureIndicator;
