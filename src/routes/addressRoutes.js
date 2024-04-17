const express = require('express')

const router = express.Router()

const authController = require('../controllers/authController')
const addressController = require('../controllers/addressController')

router.route('/').post(authController.protect, addressController.createAddress)

module.exports = router