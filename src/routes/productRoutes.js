const express = require('express')

const authController = require('../controllers/authController')
const productController = require('../controllers/productController')

const router = express.Router()
router.route('/').post(authController.protect,authController.restrictTo('admin'),productController.createProduct)
                  .get(productController.getFilteredProducts)

router.route('/:id').get(productController.getProductById)
                    .patch(authController.protect, authController.restrictTo('admin'),productController.updateProduct)
                    .delete(authController.protect,authController.restrictTo('admin'),productController.deleteProduct)

module.exports = router  
