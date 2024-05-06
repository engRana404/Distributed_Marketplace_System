const express = require('express')

const router = express.Router()

const authController = require('../controllers/authController')
const tagController = require('../controllers/tagController')

router.route('/').get(tagController.getFilteredTags)
                  .post(authController.protect, authController.restrictTo('admin'), tagController.createTag)

router.route('/:id').get(tagController.getTagById)
                    .patch(authController.protect, authController.restrictTo('admin'), tagController.updateTag)
                    .delete(authController.protect, authController.restrictTo('admin'), tagController.deleteTag)


module.exports = router