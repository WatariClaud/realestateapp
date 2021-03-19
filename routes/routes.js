// import express
const express = require('express');

// create router
const router = express.Router();

// import controller files
const userController = require('../controllers/users.controllers');

const authController = require('../controllers/auth');

router.post('/api/v1/auth/create-user', userController.createUser);

router.post('/api/v1/auth/login-user', userController.loginUser);

router.get('/api/v1/add-listing', authController.authUser, userController.postListing);


module.exports = router;