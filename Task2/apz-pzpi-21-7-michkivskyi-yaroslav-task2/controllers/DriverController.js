const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

class DriverController {
    async getAllDrivers(req, res) {
        try {
            // Находим всех водителей
            const drivers = await Driver.find();

            // Формируем ответ с проверкой свободен ли водитель
            const driversInfo = await Promise.all(drivers.map(async (driver) => {
                // Проверяем, есть ли у водителя незавершенные поездки
                const activeTrips = await Trip.find({ driverId: driver._id, status: 'started' });
                const isFree = activeTrips.length === 0;

                return {
                    driver: driver,
                    isFree: isFree
                };
            }));

            // Сортируем водителей по их доступности
            driversInfo.sort((a, b) => {
                if (a.isFree && !b.isFree) return -1;
                if (!a.isFree && b.isFree) return 1;
                // Если водители имеют одинаковый статус свободы, сортируем их по имени
                if (a.driver.name < b.driver.name) return -1;
                if (a.driver.name > b.driver.name) return 1;
                return 0;
            });

            res.status(200).json(driversInfo);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async addDriver(req, res) {
        try {
            const { name, phone } = req.body;
            const existingDriver = await Driver.findOne({ phone });
            if (existingDriver) {
                return res.status(400).json({ error: 'Driver with this phone number already exists' });
            }
            const newDriver = await Driver.create({ name, phone });
            res.status(201).json(newDriver);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getDriver(req, res) {
        try {
            const driverId = req.params.id;

            // Находим информацию о водителе
            const driver = await Driver.findById(driverId);
            if (!driver) {
                return res.status(404).json({ error: 'Driver not found' });
            }

            // Находим все поездки, в которых участвует водитель
            const trips = await Trip.find({ driverId: driverId }).sort({ status: 1, start: 1 });

            // Формируем ответ
            const response = {
                driver: driver,
                trips: trips
            };

            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async editDriver(req, res) {
        try {
            const driverId = req.params.id;
            const { name, phone } = req.body;

            const driver = await Driver.findById(driverId);
            if (!driver) {
                return res.status(404).json({ error: 'Driver not found' });
            }

            driver.name = name || driver.name;
            driver.phone = phone || driver.phone;

            const updatedDriver = await driver.save();
            res.status(200).json(updatedDriver);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteDriver(req, res) {
        try {
            const driverId = req.params.id;
            const driver = await Driver.findById(driverId);
            if (!driver) {
                return res.status(404).json({ error: 'Driver not found' });
            }
            await driver.remove();
            res.status(200).json({ message: 'Driver deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new DriverController();