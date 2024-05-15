const Trip = require('../models/Trip');
const Case = require('../models/Case');
const Driver = require('../models/Driver');
const Fridge = require('../models/Fridge');
const TripCase = require('../models/TripCase');

class TripController {
    async addTrip(req, res) {
        try {
            // Получаем данные из запроса
            const { status, start, finishPlan, finishFact, driverId, clientId } = req.body;

            // Создаем новый Trip
            const newTrip = await Trip.create({ status, start, finishPlan, finishFact, driverId, clientId });

            res.status(201).json(newTrip);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getTrip(req, res) {
        try {
            // Получаем id Trip из параметров запроса
            const tripId = req.params.id;

            // Находим Trip по его id
            const trip = await Trip.findById(tripId);

            if (!trip) {
                return res.status(404).json({ error: 'Trip not found' });
            }

            // Находим информацию о водителе
            const driver = await Driver.findById(trip.driverId);

            // Находим информацию о рефрижераторе
            const fridge = await Fridge.findOne({ timestamp: { $exists: false } });

            // Находим информацию о кейсе по TripCase
            const tripCases = await TripCase.find({ tripId });

            // Подставляем инвентарный номер кейса вместо его id
            const tripCasesInfo = await Promise.all(tripCases.map(async (tripCase) => {
                const caseInfo = await Case.findById(tripCase.caseId);
                return {
                    inventoryNumber: caseInfo.inventoryNumber,
                    price: tripCase.price,
                    filling: tripCase.filling,
                    maxTemperature: tripCase.maxTemperature
                };
            }));

            res.status(200).json({ trip, driver, fridge, tripCasesInfo });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getTripClient(req, res) {
        try {
            // Получаем id клиента из параметров запроса
            const clientId = req.params.id;

            // Находим Trip по id клиента и проверяем его принадлежность
            const trips = await Trip.find({ clientId });

            if (!trips) {
                return res.status(404).json({ error: 'Trips not found for client' });
            }

            // Подставляем инвентарный номер кейса вместо его id и информацию о рефрижераторе
            const tripsInfo = await Promise.all(trips.map(async (trip) => {
                const tripCases = await TripCase.find({ tripId: trip._id });
                const tripCasesInfo = await Promise.all(tripCases.map(async (tripCase) => {
                    const caseInfo = await Case.findById(tripCase.caseId);
                    return {
                        inventoryNumber: caseInfo.inventoryNumber,
                        price: tripCase.price,
                        filling: tripCase.filling,
                        maxTemperature: tripCase.maxTemperature
                    };
                }));
                const fridge = await Fridge.findOne({ timestamp: { $exists: false } });
                return { trip, tripCasesInfo, fridgeLocation: fridge.location };
            }));

            res.status(200).json(tripsInfo);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getResourses(req, res) {
        try {
            // Получаем доступные кейсы
            const cases = await Case.find({});

            // Получаем доступные водители
            const drivers = await Driver.find({});

            // Получаем доступные рефрижераторы
            const fridges = await Fridge.find({ timestamp: { $exists: false } });

            res.status(200).json({ cases, drivers, fridges });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async finishTrip(req, res) {
        try {
            // Получаем id Trip из параметров запроса
            const tripId = req.params.id;

            // Обновляем статус завершения поездки
            const updatedTrip = await Trip.findByIdAndUpdate(tripId, { status: 'completed' }, { new: true });

            res.status(200).json(updatedTrip);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new TripController();