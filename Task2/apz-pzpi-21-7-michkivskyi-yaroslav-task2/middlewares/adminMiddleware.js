const jwt = require('jsonwebtoken');
const { secret } = require("../config");
const Admin = require('../models/Admin');

const adminMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized. Token missing.' });
    }
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Token missing.' });
    }

    try {
        const decodedToken = jwt.verify(token, secret);
        const role = decodedToken.role;
        if (role==="admin"){
            const adminId=decodedToken.identifier
            const adminExists = await Admin.findOne({ "_id": adminId });
            if (adminExists) {
                req.adminId = decodedToken.identifier;
                next();
            } else {
                res.status(403).json({ message: 'Access denied. Admin account undefined' });
            }
        }
        else {
            res.status(403).json({ message: 'Access denied. Admin role required' });
        }

    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    }
};
module.exports = adminMiddleware;