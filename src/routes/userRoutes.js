const express = require("express");

const authController = require('../controllers/authController')
const userController = require('../controllers/userController')



const router = express.Router() 
router.get('/',authController.protect, authController.restrictTo('admin'),userController.findAllUser)
router.route('/me').get(authController.protect,userController.getMe)
                  .patch(authController.protect, userController.updateMe)
router.patch('/:id/set-as-admin',authController.protect, userController.setAdmin)
router.route('/me/cart').get(authController.protect, userController.getMyCart)
                        .post(authController.protect, userController.addProductToCart)
router.delete('/me/cart/:productId',authController.protect, userController.removeProductFromCart)
router.route('/me/wishlist').get(authController.protect, userController.getMyWishlist)
                        .post(authController.protect, userController.addProductToWishlist)
router.delete('/me/wishlist/:productId',authController.protect, userController.removeProductFromWishlist)
router.get('/me/orders',authController.protect,userController.getMyOrders)
router.get('/me/addresses',authController.protect,userController.getMyAddresses)
router.get('/me/vouchers',authController.protect,userController.getMyVouchers)

module.exports = router 