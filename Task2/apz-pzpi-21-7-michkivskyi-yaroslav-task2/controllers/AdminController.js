const Admin = require('../models/Admin');
const Case = require('../models/Case');
const Client = require('../models/Client');
const Driver = require('../models/Driver');
const Fridge = require('../models/Fridge');
const TemperatureIndicator = require('../models/TemperatureIndicator');
const Trip = require('../models/Trip');
const TripCase = require('../models/TripCase');
const path = require("path");
const fs = require("fs");
const rootFolderPath = path.join(__dirname, '../backups/');
const { generateJWT } = require("../services/jwtService");
const bcrypt = require('bcryptjs');

class AdminController {

    async registerAdmin(req, res) {
        try {
            const {login, password, name} = req.body;

            const existingAdmin = await Admin.findOne({login});
            if (existingAdmin) {
                return res.status(400).json({error: 'Admin with this login already exists'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = await Admin.create({login, password:hashedPassword, name});
            res.status(201).json(newAdmin);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

    async loginAdmin(req, res) {
        try {
            const { login, password } = req.body;

            const admin = await Admin.findOne({ login });
            if (!admin) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = generateJWT('admin', admin._id, admin.name);
            res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async importDatabase(request, response) {
        try {
            const backups = fs.readdirSync(rootFolderPath);
            const sortedBackups = backups.sort((a, b) => {
                const aDate = a.slice(0, 13);
                const bDate = b.slice(0, 13);
                return bDate - aDate;
            });

            if (sortedBackups.length === 0) {
                return response.status(400).json({message: "No backup files found."});
            }

            const rawData = JSON.parse(fs.readFileSync(path.join(rootFolderPath, sortedBackups[0])));

            // Deleting all existing data
            await Admin.deleteMany({});
            await Case.deleteMany({});
            await Client.deleteMany({});
            await Driver.deleteMany({});
            await Fridge.deleteMany({});
            await TemperatureIndicator.deleteMany({});
            await Trip.deleteMany({});
            await TripCase.deleteMany({});

            const saveDocuments = async (Model, data) => {
                for (const item of data) {
                    const document = new Model(item);
                    await document.save();
                }
            };

            // Importing new data
            await saveDocuments(Admin, rawData.admins);
            await saveDocuments(Case, rawData.cases);
            await saveDocuments(Client, rawData.clients);
            await saveDocuments(Driver, rawData.drivers);
            await saveDocuments(Fridge, rawData.fridges);
            await saveDocuments(TemperatureIndicator, rawData.temperatureIndicators);
            await saveDocuments(Trip, rawData.trips);
            await saveDocuments(TripCase, rawData.tripCases);

            return response.status(201).json({message: 'Database imported successfully.'});
        } catch (error) {
            console.error("Import Error:", error);
            return response.status(500).json({message: "Failed to import database", error: error.message});
        }
    }

    async exportDatabase(request, response) {
        try {
            const [admins, cases, clients, drivers, fridges, temperatureIndicators, trips, tripCases] = await Promise.all([
                Admin.find(),
                Case.find(),
                Client.find(),
                Driver.find(),
                Fridge.find(),
                TemperatureIndicator.find(),
                Trip.find(),
                TripCase.find()
            ]);

            const exportData = {
                admins,
                cases,
                clients,
                drivers,
                fridges,
                temperatureIndicators,
                trips,
                tripCases
            };

            const currentDate = new Date();
            const filePath = path.join(rootFolderPath, `${currentDate.getTime()}.json`);

            fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));

            return response.status(200).json({message: 'Data exported successfully.', filePath});
        } catch (error) {
            console.error("Export Error:", error);
            return response.status(500).json({message: "Failed to export database", error: error.message});
        }
    }
}

module.exports = new AdminController();