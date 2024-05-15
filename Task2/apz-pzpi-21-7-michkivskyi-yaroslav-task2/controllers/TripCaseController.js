const TripCase = require('../models/TripCase');
const TemperatureIndicator = require('../models/TemperatureIndicator');

class TripCaseController {
    async addTripCase(req, res) {
        try {
            // Получаем данные из запроса
            const { tripId, caseId, price, filling, maxTemperature } = req.body;

            // Создаем новый TripCase
            const newTripCase = await TripCase.create({ tripId, caseId, price, filling, maxTemperature });

            res.status(201).json(newTripCase);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getTripCase(req, res) {
        try {
            // Получаем id TripCase из параметров запроса
            const tripCaseId = req.params.id;

            // Находим TripCase по его id
            const tripCase = await TripCase.findById(tripCaseId);

            if (!tripCase) {
                return res.status(404).json({ error: 'TripCase not found' });
            }

            res.status(200).json(tripCase);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getTripCaseClient(req, res) {
        try {
            // Получаем id клиента из параметров запроса
            const clientId = req.params.id;

            // Находим TripCase по id клиента и проверяем его принадлежность к Trip клиента
            const tripCases = await TripCase.find({ tripId: { $in: tripIds } });

            if (!tripCases) {
                return res.status(404).json({ error: 'TripCases not found for client' });
            }

            res.status(200).json(tripCases);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async addTemperatureIndicator(req, res) {
        try {
            // Получаем данные из запроса
            const { tripCaseId, caseId, dateTime, temperature } = req.body;

            // Создаем новый TemperatureIndicator
            const newTemperatureIndicator = await TemperatureIndicator.create({ tripCaseId, caseId, dateTime, temperature });

            res.status(201).json(newTemperatureIndicator);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new TripCaseController();