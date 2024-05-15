const Admin = require('../models/Admin');
const { generateJWT } = require("../services/jwtService");

class AdminController {

    async registerAdmin(req, res) {
        try {
            const { login, password, name } = req.body;

            const existingAdmin = await Admin.findOne({ login });
            if (existingAdmin) {
                return res.status(400).json({ error: 'Admin with this login already exists' });
            }

            const newAdmin = await Admin.create({ login, password, name });
            res.status(201).json(newAdmin);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async loginAdmin(req, res) {
        try {
            const { login, password } = req.body;
            const admin = await Admin.findOne({ login, password });
            if (!admin) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = generateJWT('admin', admin._id, admin.name)
            res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new AdminController();