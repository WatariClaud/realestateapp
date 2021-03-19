const jwt = require('jsonwebtoken');

const{ pool } = require('../config');

let user = {};

const authUser = (req, res, next) => {

    const token = req.header('authorization')

    if(!token) {
        return res.status(403).json({
            error: 'No token found'
        });
    }

    jwt.verify(token, process.env.secret_key, (errorVerifyingToken, decodedToken) => {
        if(errorVerifyingToken) throw errorVerifyingToken;

        if(!decodedToken) {
            return res.status(403).json({
                error: 'Verification error - no session found'
            });
        }

        const sessionuser = decodedToken.phone;

        user.phone = sessionuser;

        pool.query(`
            SELECT * FROM users WHERE phone = $1
        `,[sessionuser], (errorGettingUser, matchFoundForUserToken) => {
            if(errorGettingUser) throw errorGettingUser;

            if(matchFoundForUserToken.rows.length < 1) {
                return res.status(404).json({
                    error: 'Invalid phone number, retry your login'
                });
            }

            next();
        });
    });
};

module.exports = {
    authUser,
    user
}