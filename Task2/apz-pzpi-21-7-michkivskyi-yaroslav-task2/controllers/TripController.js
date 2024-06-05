const Trip = require('../models/Trip');
const Case = require('../models/Case');
const Driver = require('../models/Driver');
const Fridge = require('../models/Fridge');
const TripCase = require('../models/TripCase');
const temperatureExceededService = require('../services/temperatureExceededService');

class TripController {
    async addTrip(req, res) {
        try {
            const { finishPlan, driverId, clientId, fridgeId } = req.body;

            const finishPlanDate = new Date(finishPlan)
            const newTrip = await Trip.create({ finishPlan:finishPlanDate, driverId, clientId, fridgeId });

            res.status(201).json(newTrip);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getTrip(req, res) {
        try {
            const tripId = req.params.id;
            const trip = await Trip.findById(tripId);

            if (!trip) {
                return res.status(404).json({ error: 'Trip not found' });
            }

            const driver = await Driver.findById(trip.driverId);
            const fridge = await Fridge.findById(trip.fridgeId);
            const tripCases = await TripCase.find({ tripId });

            const tripCasesInfo = await Promise.all(tripCases.map(async (tripCase) => {
                const caseInfo = await Case.findById(tripCase.caseId);
                const statistics = await temperatureExceededService.calculateStatistics(tripCase._id)

                return {
                    inventoryNumber: caseInfo.inventoryNumber,
                    price: tripCase.price,
                    filling: tripCase.filling,
                    maxTemperature: tripCase.maxTemperature,
                    tripCaseId:tripCase._id,
                    caseId:tripCase.caseId,
                    statistics
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
            const clientId = req.params.clientId;
            const trips = await Trip.find({ clientId });

            if (!trips) {
                return res.status(404).json({ error: 'Trips not found for client' });
            }

            const tripsInfo = await Promise.all(trips.map(async (trip) => {
                const tripCases = await TripCase.find({ tripId: trip._id });
                const tripCasesInfo = await Promise.all(tripCases.map(async (tripCase) => {
                    const caseInfo = await Case.findById(tripCase.caseId);
                    const statistics = await temperatureExceededService.calculateStatistics(tripCase._id);

                    return {
                        inventoryNumber: caseInfo.inventoryNumber,
                        price: tripCase.price,
                        filling: tripCase.filling,
                        maxTemperature: tripCase.maxTemperature,
                        tripCaseId:tripCase._id,
                        caseId:tripCase.caseId,
                        statistics
                    };
                }));
                const fridge = await Fridge.findById(trip.fridgeId);
                return { trip, tripCasesInfo, fridgeLocation: fridge.location };
            }));

            res.status(200).json(tripsInfo);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getResources(req, res) {
        try {
            // Отримуємо всі активні поїздки
            const activeTrips = await Trip.find({ finishFact: { $exists: false } });

            // Отримуємо масиви ID зайнятих водіїв, холодильників та кейсів
            const occupiedDrivers = activeTrips.map(trip => trip.driverId);
            const occupiedFridges = activeTrips.map(trip => trip.fridgeId);
            const activeTripCases = await TripCase.find({ tripId: { $in: activeTrips.map(trip => trip._id) } });
            const occupiedCases = activeTripCases.map(tripCase => tripCase.caseId);

            // Отримуємо незайняті кейси
            const availableCases = await Case.find({ _id: { $nin: occupiedCases } });

            // Отримуємо незайнятих водіїв
            const availableDrivers = await Driver.find({ _id: { $nin: occupiedDrivers } });

            // Отримуємо незайняті холодильники
            const availableFridges = await Fridge.find({ _id: { $nin: occupiedFridges } });

            res.status(200).json({ cases: availableCases, drivers: availableDrivers, fridges: availableFridges });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async finishTrip(req, res) {
        try {
            const tripId = req.params.id;

            const updatedTrip = await Trip.findByIdAndUpdate(tripId, { status: 'completed' }, { new: true });

            res.status(200).json(updatedTrip);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAllTrips(req, res) {
        try {
            const trips = await Trip.find().sort({ finishFact: 1, start: 1 });
            res.status(200).json(trips);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getClientTrips(req, res) {
        try {
            const clientId = req.params.clientId;
            const trips = await Trip.find({ clientId }).sort({ finishFact: 1, start: 1 });
            res.status(200).json(trips);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new TripController();