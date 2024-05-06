const express = require('express')

const router = express.Router()

const authController = require('../controllers/authController')
const addressController = require('../controllers/addressController')

router.route('/').post(authController.protect, addressController.createAddress)
                  .get(authController.protect, authController.restrictTo('admin'), addressController.getFilteredAddresses)
                  

router.route('/:id').get(authController.protect, addressController.getAddressById)
                    .patch(authController.protect, addressController.updateAddress)
                    .delete(authController.protect, addressController.deleteAddress)


module.exports = router