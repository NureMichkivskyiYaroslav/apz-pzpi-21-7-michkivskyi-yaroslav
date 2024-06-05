const Client = require('../models/Client');
const Trip = require('../models/Trip');
const {generateJWT} = require("../services/jwtService");
const bcrypt = require('bcryptjs')

class ClientController {
    async registerClient(req, res) {
        try {
            const { login, password, name, phone } = req.body;

            const existingClient = await Client.findOne({ login });
            if (existingClient) {
                return res.status(400).json({ error: 'Client with this login already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newClient = await Client.create({ login, password: hashedPassword, name, phone });
            res.status(201).json(newClient);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async loginClient(req, res) {
        try {
            const { login, password } = req.body;

            const client = await Client.findOne({ login });
            if (!client) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, client.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = generateJWT('client', client._id, client.name);
            res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getClientTrips(req, res) {
        try {
            const clientId = req._id;
            const clientTrips = await Trip.find({ clientId }).select('status start finishPlan finishFact');
            res.status(200).json(clientTrips);
        } catch (error) {
            console.error('Error getting client trips:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getClientById(req, res) {
        try {
            const clientId = req.params.id;
            const client = await Client.findById(clientId);

            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }

            const trips = await Trip.find({ clientId: client?._id });

            const tripsInfo = trips?.map(trip => ({
                status: trip.status,
                start: trip.start,
                finishPlan: trip.finishPlan,
                finishFact: trip.finishFact || 'Not finished yet'
            }));

            const response = {
                client: client,
                trips: tripsInfo,
            };

            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAllClients(req, res) {
        try {
            const clients = await Client.find().select('-__v');

            res.status(200).json(clients);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}



module.exports = new ClientController();