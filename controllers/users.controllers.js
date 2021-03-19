const { pool } = require('../config');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const checkers = require('../checkers/checkers');

const auth = require('./auth');

const createUser = (req, res) => {
    const {
        fullname, phone, email, password
    } = req.body;

    if(!fullname) return res.status(409).json({ error: `Full name is required` });

    if(!phone) return res.status(409).json({ error: `Phone is required` });

    if(!email) return res.status(409).json({ error: `Email is required` });

    if(!password) return res.status(409).json({ error: `Password is required` });

    if(!phone.split('+')[1]) return res.status(409).json({ error: `Country code is required` });

    if(phone.split('+')[0]) return res.status(409).json({ error: `Invalid phone number` });

    if(phone.length <= 6) return res.status(409).json({ error: `Please enter a valid phone number` });

    if(email.length <= 6) return res.status(409).json({ error: `Please enter a valid email address` });

    if(password.length <= 7) return res.status(409).json({ error: `Password must be at least 8 characters` });

    if(!checkers.checkIsValidAlphabeticString(fullname)) return res.status(409).json({ error: `Only letters and spaces allowed in the name` });

    if(!checkers.checkIsValidEmailInput(email)) return res.status(409).json({ error: `Please enter a valid email address` });

    if(!checkers.checkIsValidNumberInput(phone.split('+')[1])) return res.status(409).json({ error: `Invalid phone number` });

    pool.query(`
        SELECT * FROM users WHERE phone = $1 OR email = $2
    `, [phone, email], (error, match) => {
        if(error) throw error;

        if(match.rows.length > 0) return res.status(409).json({ error: `User already exists with these credentials. Try logging in.` });

        bcrypt.hash(password, 12, (unhash, hash) => {
            if(unhash) throw unhash;

            if(!hash) return res.status(400).json({ error: `An error occured, please try again` });

            pool.query(`
                INSERT INTO users
                (fullname, phone, email, password)
                VALUES
                ($1, $2, $3, $4)
            `, [fullname, phone, email, hash], (errorAdding, added) => {
                if(errorAdding) throw errorAdding;

                const token = jwt.sign({
                    phone: phone
                }, process.env.secret_key);

                res.status(200).json({
                    message: 'User added successfully.',
                    token: token
                });
            });
        })
    });
};

const loginUser = (req, res) => {
    const {
        credentials, password
    } = req.body;

    if(!credentials) return res.status(409).json({ error: `Email or phone required` });

    if(!password) return res.status(409).json({ error: `Password is required` });

    pool.query(`
        SELECT * FROM users WHERE phone = $1 OR email = $2
    `, [credentials, credentials], (error, match) => {
        if(error) throw error;

        if(match.rows.length < 1) return res.status(404).json({ error: `No user found with those credentials. Try creating an account.` });

        bcrypt.compare(password, match.rows[0].password, (errorComparing, passwordMatch) => {
            if(errorComparing) throw errorComparing;

            if(!passwordMatch) return res.status(403).json({ error: `Inorrect password.`, optional: `Request for a password change.` });

            const token = jwt.sign({
                phone: match.rows[0].phone
            }, process.env.secret_key);            

            res.status(200).json({
                message: 'Log in successful',
                token: token
            });

        });
    });
};

const postListing = (req, res) => {
    pool.query(`
        SELECT * FROM users WHERE phone = $1
    `, [auth.user.phone], (error, match) => {
        if(error) throw error;

        if(match.rows.length < 1) return res.status(404).json({ error: `Retry your login` });
        
        const {
            images, description, location, price, availability, listingtype
        } = req.body;

        if(!price) return res.status(409).json({ error: `Price is required for this listing.` });

        if(!availability) return res.status(409).json({ error: `Specify the availability of this listing.` });

        if(!location) return res.status(409).json({ error: `Location is required for this listing.` });

        if(!listingtype) return res.status(409).json({ error: `Please specify the terms of this listing` });

        if(!images) return res.status(409).json({ error: `At least one image is required for this listing` });

        if(!description) return res.status(409).json({ error: `Please write a brief description for this listing.` });

        if(!checkers.checkIsValidNumberInput(price)) return res.status(409).json({ error: `Price must be a number.` });

        if(description.length <= 100) return res.status(409).json({ error: `Description must be at least 100 words.` });

        pool.query(`
            INSERT INTO listings
            (byuser, listingimage, description, location, typeoflisting, isavailable, price)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7)
        `, [match.rows[0].userid, images, description, location, listingtype, availability, price], (errorAddingListing, listingAdded) => {
            if(errorAddingListing) throw errorAddingListing;

            res.status(200).json({ message: `Added successfuly. To add image upload` })
        });
    });
};

module.exports = {
    createUser,
    loginUser,
    postListing
}