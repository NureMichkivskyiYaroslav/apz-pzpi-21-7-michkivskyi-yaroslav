const mongoose = require('mongoose');

const fridgeSchema = new mongoose.Schema({
    inventoryNumber: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            // масив чисел для зберігання координат [довгота, широта]
            type: [Number],
            required: true
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

fridgeSchema.index({ location: '2dsphere' });

const Fridge = mongoose.model('Fridge', fridgeSchema);

module.exports = Fridge;