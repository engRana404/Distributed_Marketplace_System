const express = require('express')

const router = express.Router()

const authController = require('../controllers/authController')
const voucherController = require('../controllers/voucherController')

router.route('/').post(authController.protect,authController.restrictTo('admin'), voucherController.createVoucher)
                  .get(authController.protect, authController.restrictTo('admin'), voucherController.getFilteredVouchers)
                  

router.route('/:id').get(authController.protect,authController.restrictTo('admin'), voucherController.getVoucherById)
                    .patch(authController.protect,authController.restrictTo('admin'), voucherController.updateVoucher)
                    .delete(authController.protect,authController.restrictTo('admin'), voucherController.deleteVoucher)

router.route('/:id/assign-to-users').post(authController.protect,authController.restrictTo('admin'), voucherController.assignVoucherToUsers)


module.exports = router