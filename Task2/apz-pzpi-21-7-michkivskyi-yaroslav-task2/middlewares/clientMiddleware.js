const jwt = require('jsonwebtoken');
const { secret } = require("../config");
const Client = require('../models/Client');

const clientMiddleware = async (req, res, next) => {
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
        if (role==='client'){
            const clientID=decodedToken.identifier
            const clientExists = await Client.findOne({ "_id": clientID });
            if (clientExists) {
                req.params.clientId = decodedToken.identifier;
                next();
            } else {
                res.status(403).json({ message: 'Access denied. Client undefined' });
            }
        }
        else {
            res.status(403).json({message: 'Access denied. Client role required'});
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    }
};
module.exports = clientMiddleware;