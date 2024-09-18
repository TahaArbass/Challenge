// middle ware to check if user is authorized with a valid token in bearer header
require('dotenv').config();

const AuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    // check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, No Token!' });
    }

    // check if token is valid
    if (token !== process.env.TOKEN) {
        return res.status(401).json({ message: 'Unauthorized, Invalid Token!' });
    }

    next();
}

module.exports = AuthMiddleware;