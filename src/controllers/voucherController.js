const { Voucher, UserVoucher, User} = require('../models')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const filterObj = require('../utils/filterObj')
const sequelize = require('../config/database')
const { Op } = require('@sequelize/core');

exports.createVoucher = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body,'expiresAt','code','description','value','voucherType','minimumPurchaseAmount', 'maximumDiscountAmount', 'status')
  const voucher = await Voucher.create(filteredBody)
  res.status(201).json({
    status: "success",
    data: {
      voucher
    }
  })
})

exports.getFilteredVouchers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit
  const filter = {
    [Op.and]: [
      req.query.code ? {
        code: {
          [Op.like]: sequelize.literal(`'%${req.query.code}%'`)
        }
      }: {},
      req.query.voucherType ? {
        voucherType: req.query.voucherType
      } : {},
      req.query.status ? {
        status: req.query.status
      } : {},
      req.query.startExpiryDate && req.query.endExpiryDate ? {
        expiresAt: {
        [Op.and]: [
           {[Op.gte]: req.query.startExpiryDate},
           {[Op.lte]: req.query.endExpiryDate }
        ]
      }
    }: req.query.startExpiryDate ? {
      expiresAt: {[Op.gte]: req.query.startExpiryDate}
    }: req.query.endExpiryDate ? {
      expiresAt: {[Op.lte]: req.query.endExpiryDate }
    }:
    {}
    ]
  }

  const vouchers = await Voucher.findAll({
    where: filter,
    limit,
    offset,
    order: [['createdAt','DESC']],
  })

  res.status(200).json({
    status: "success",
    data: {
      vouchers
    }
  })

})

exports.getVoucherById = catchAsync(async (req, res, next) => {
  const voucher = await Voucher.findByPk(req.params.id,{
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'imageUrl'],
        through: {
          attributes: []
        }
      }
    ]
  })
  res.status(200).json({
    status: "success",
    data: {
      voucher
    }
  })
})

exports.updateVoucher = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body,'expiresAt','code','description','value','voucherType','minimumPurchaseAmount', 'maximumDiscountAmount', 'status')
  const [rowsAffected, updatedRows] = await Voucher.update(filteredBody,{
    where: {
      id: req.params.id
    },
    returning: true
  })

  if(rowsAffected === 0){
    return next(new AppError("No Voucher with this id!", 404))
  }
  res.status(200).json({
    status: "success",
    data: {
      address: updatedRows[0]
    }
  })
})

exports.deleteVoucher = catchAsync(async (req, res, next) => {
  const deletedVoucher = await Voucher.destroy({
    where: {
      id: req.params.id
    }
  })
  if(!deletedVoucher){
    return next(new AppError("No Voucher with this id!", 404))
  }
  res.status(204).json({
    status: "success" 
  })
})

exports.assignVoucherToUsers = catchAsync(async (req, res, next) => {
  const userVouchersList = []
  for(let userData of req.body.usersData){
  const userVoucher = await UserVoucher.create({
    userId: userData.id,
    voucherId: req.params.id,
    usageLimit: userData.usageLimit
  })
  userVouchersList.push(userVoucher)
  }
  res.status(200).json({
    status: "success",
    data: {
      userVouchers: userVouchersList
    }
  })
})