const { Order, OrderItem, Product, Voucher, User, UserVoucher} = require('../models')
const sequelize = require('../config/database')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')


exports.createOrder = catchAsync(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  const order = await Order.create({
    userId: req.user.id,
    addressId: req.body.addressId,
    voucherId: req.bosy.voucherId || null
  },{
    transaction
  })
  let totalAmount = order.shippingFees
  
  for(const item of req.body.items){
    const product = await Product.findByPk(item.productId,{transaction})
    if(!product){
      return next(new AppError(`No product with this id.`,400))
    }
    const orderItem = await OrderItem.create({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
      orderId: order.id
    },{transaction})
    totalAmount += orderItem.price
    product.quantity -= orderItem.quantity
    await product.save({transaction})
  }
  let finalTotalAmount = totalAmount

  if(req.body.voucherId){
    const voucher = await Voucher.findOne({
      where: {
        [sequelize.op.and]: {
          id: req.body.voucherId,
          expiresAt: {
            [sequelize.op.gt]: new Date()
          },
          status: 'active'
        }     
      }
    },{transaction})
    if(!(voucher.voucherType === "fixedAmountDiscount" || voucher.voucherType === "referralDiscount") || voucher.minimumPurchaseAmount <= totalAmount-order.shippingFees){
      const [rowsAffected] = await UserVoucher.update({
        usageLimit: sequelize.literal('usageLimit - 1')
      },
      {
        transaction,
        where: {
          userId: req.user.id,
          voucherId: req.body.voucherId,
          usageLimit: { [sequelize.op.gt]: 0 }
        }
      })
      order.voucherId = req.body.voucherId
      if(rowsAffected > 0){
      if(voucher.voucherType === "freeShipping"){
        finalTotalAmount -= order.shippingFees
      }else if(voucher.voucherType === "fixedAmountDiscount" || voucher.voucherType === "referralDiscount"){
        finalTotalAmount -= voucher.value
      }else if(voucher.voucherType === "rateDiscount"){
        let discountAmount = Math.min(((totalAmount - order.shippingFees) * voucher.value), voucher.maximumDiscountAmount) 
        finalTotalAmount -= discountAmount
      }
    }
    }
  }

  order.finalTotalAmount = finalTotalAmount
  order.totalAmount = totalAmount
  await order.save({transaction})
  await transaction.commit();

  res.status(201).json({
    status:"success",
    data: {
      order
    }})
})

exports.getFilteredOrders = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit
  const filter = {
    [sequelize.op.and]: [
      {satatus: req.query.status ? req.query.status : undefined},
      {createdAt: {
        [sequelize.op.and]: [
          req.query.startDate ? {[sequelize.op.gte]: req.query.startDate}: {},
          req.query.endDate ? {[sequelize.op.lte]: req.query.endDate}: {}
        ]
      }}
    ]
  }

  const orders = await Order.findAll({
    limit,
    offset,
    order: [['createdAt','DESC']],
    where: filter
  })

  res.status(200).json({
    status: "success",
    data: {
      orders
    }
  })

})

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id)
  if(!order) {
    return next(new AppError('No order with this id', 404))
  }
  if(order.userId !== req.user.id || req.user.role !== 'admin'){
    return next(new AppError(`You don't have permission to perform this action.`,403))
  }
  res.status(200).json({
    status: "success",
    data: {
      order
    }
  })
})