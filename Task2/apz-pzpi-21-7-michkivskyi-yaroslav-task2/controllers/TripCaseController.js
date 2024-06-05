const Trip =   require('../models/Trip');
const TripCase = require('../models/TripCase');
const TemperatureIndicator = require('../models/TemperatureIndicator');
const temperatureExceededService = require("../services/temperatureExceededService");

class TripCaseController {
    async addTripCase(req, res) {
        try {
            const { tripId, caseId, filling, maxTemperature } = req.body;

            const newTripCase = await TripCase.create({ tripId, caseId,  filling, maxTemperature });

            res.status(201).json(newTripCase);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getTripCase(req, res) {
        try {
            const tripCaseId = req.params.id;

            const tripCase = await TripCase.findById(tripCaseId);

            if (!tripCase) {
                return res.status(404).json({ error: 'TripCase not found' });
            }

            const temperatureIndicators = await TemperatureIndicator.find({ tripCaseId });
            const statistics = await temperatureExceededService.calculateStatistics(tripCase._id)

            res.status(200).json({tripCase, statistics, temperatureIndicators});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getTripCaseClient(req, res) {
        try {
            const clientId = req.params.clientId;
            const tripCaseId = req.params.id;

            const tripCase = await TripCase.findById(tripCaseId);

            if (!tripCase) {
                return res.status(404).json({ error: 'TripCase not found' });
            }

            const trip = await Trip.findById(tripCase.tripId);

            if (!trip || trip.clientId.toString() !== clientId) {
                return res.status(403).json({ error: 'TripCase does not belong to the client\'s trip' });
            }

            const temperatureIndicators = await TemperatureIndicator.find({ tripCaseId });

            const statistics = await temperatureExceededService.calculateStatistics(tripCase._id);

            res.status(200).json({
                tripCase,
                temperatureIndicators,
                statistics
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async addTemperatureIndicator(req, res) {
        try {
            // Отримуємо масив даних з тіла запиту
            const indicators = req.body;

            const newIndicators = [];

            for (const indicator of indicators) {
                const { caseId, dateTime, temperature } = indicator;

                // Знаходимо всі tripCase з вказаним caseId
                const tripCases = await TripCase.find({ caseId });

                // Перевіряємо кожен tripCase, щоб знайти активний trip (без finishFact)
                for (const tripCase of tripCases) {
                    const trip = await Trip.findById(tripCase.tripId);

                    if (trip && !trip.finishFact) {
                        // Якщо trip не має finishFact, створюємо новий TemperatureIndicator
                        const newTemperatureIndicator = await TemperatureIndicator.create({ tripCaseId: tripCase._id, caseId, dateTime, temperature });
                        newIndicators.push(newTemperatureIndicator);
                        break;
                    }
                }
            }

            res.status(201).json(newIndicators);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new TripCaseController();