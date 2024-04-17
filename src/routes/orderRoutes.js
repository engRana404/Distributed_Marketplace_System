const express = require('express')

const authController = require('../controllers/authController')
const orderController = require('../controllers/orderController')

const router = express.Router()
router.post('/',authController.protect,authController.restrictTo('admin'),orderController.createOrder)
router.get('/',authController.protect,authController.restrictTo('admin'),orderController.getFilteredOrders)
router.get('/:id',authController.protect,orderController.getOrderById)

module.exports = router
 