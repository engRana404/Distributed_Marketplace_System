const {Address, User} = require('../models')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const filterObj = require('../utils/filterObj')
const sequelize = require('../config/database')
const { Op } = require('@sequelize/core');

exports.createAddress = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body,'streetAddress','city','province','postalCode')
  filteredBody.userId = req.user.id
  const address = await Address.create(filteredBody)
  res.status(201).json({
    status: "success",
    data: {
      address
    }
  })
})

exports.getFilteredAddresses = catchAsync(async (req, res, next) => {

})

exports.getAddressById = catchAsync(async (req, res, next) => {
  const address = await Address.findByPk(req.params.id)
  if(!address) {
    return next(new AppError('No address with this id!',404))
  }
  if(address.userId !== req.user.id || req.user.role !== 'admin'){
    return next(new AppError(`You don't have permission to perform this action.`,403))
  }

  res.status(200).json({
    status: "success",
    data: {
      address
    }
  })
})