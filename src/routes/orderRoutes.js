const express = require('express')

const authController = require('../controllers/authController')
const orderController = require('../controllers/orderController')

const router = express.Router()
router.route('/').post(authController.protect,orderController.createOrder)
                .get(authController.protect,authController.restrictTo('admin'),orderController.getFilteredOrders)
router.route('/:id').get(authController.protect,orderController.getOrderById)
                    .patch(authController.protect,authController.restrictTo('admin'),orderController.updateOrder)
router.patch('/:id/check-order',authController.protect, orderController.checkPaymentIntentAndConfirmOrder)

module.exports = router
 