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
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit
  const filter = {
    [Op.and]: [
      req.query.streetAddress ? {
        streetAddress: {
          [Op.iLike]: sequelize.literal(`'%${req.query.streetAddress}%'`)
        }
      } : {},
      req.query.city ? {
        city: {
          [Op.iLike]: sequelize.literal(`'%${req.query.city}%'`)
        }
      }: {},
      req.query.province ? {
        province: {
          [Op.iLike]: sequelize.literal(`'%${req.query.province}%'`)
        }
      }: {},
      req.query.userId ? {
        userId: req.query.userId 
      }: {}
    ]
  }
  const addresses = await Address.findAll({
    limit,
    offset,
    where: filter,
    order: [['createdAt','DESC']],
  })

  res.status(200).json({
    status: "success",
    data: {
      addresses
    }
  })
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

exports.updateAddress = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body,'streetAddress','city','province','postalCode')
  const [rowsAffected, updatedRows] = await Address.update(filteredBody,{
    where: {
      [Op.and]: [
        {
          id: req.params.id
        },
        {
          userId: req.user.id
        }
      ]
    },
    returning: true
  })
  if(rowsAffected === 0){
    return next(new AppError("No Address with this id!", 404))
  }
  res.status(200).json({
    status: "success",
    data: {
      address: updatedRows[0]
    }
  })


})

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const deletedAddress = await Address.destroy({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  })
 if(!deletedAddress) {
  return next(new AppError("No Address with this id!", 404))

 }
  res.status(204).json({
    status: "success" 
  })
})