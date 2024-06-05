const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

class DriverController {
    async getAllDrivers(req, res) {
        try {
            const drivers = await Driver.find();

            const driversInfo = await Promise.all(drivers.map(async (driver) => {
                const activeTrips = await Trip.find({ driverId: driver._id, status: 'started' });
                const isFree = activeTrips.length === 0;

                return {
                    driver: driver,
                    isFree: isFree
                };
            }));

            driversInfo.sort((a, b) => {
                if (a.isFree && !b.isFree) return -1;
                if (!a.isFree && b.isFree) return 1;
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
            const newDriver = new Driver({ name, phone });
            await newDriver.save()
            res.status(201).json(newDriver);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getDriver(req, res) {
        try {
            const driverId = req.params.id;

            const driver = await Driver.findById(driverId);
            if (!driver) {
                return res.status(404).json({ error: 'Driver not found' });
            }

            const trips = await Trip.find({ driverId: driverId }).sort({ status: 1, start: 1 });

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

            await driver.save();
            res.status(200).json({"id":driverId, "name":driver.name, "phone":driver.phone});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteDriver(req, res) {
        try {
            const driverId = req.params.id;
            const driver = await Driver.findByIdAndDelete(driverId);
            if (!driver) {
                return res.status(404).json({ error: 'Driver not found' });
            }
            res.status(200).json({ message: 'Driver deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new DriverController();