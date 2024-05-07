const { Order, OrderItem, Product, Voucher, User, UserVoucher, Cart, Order2, Cart2, OrderItem2, UserVoucher2, Product2, Voucher2, User2} = require('../models')
const {sequelize,sequelize2} = require('../config/database')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const filterObj = require('../utils/filterObj')
const { createPaymentIntent, retrievePaymentIntent } = require('../utils/stripe')
const { Op, literal } = require('sequelize')
const { getNewId } = require('../utils/getNewId')


exports.createOrder = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body,'addressId','voucherId')
  filteredBody.userId = req.user.id
  filteredBody.id = await getNewId(Order, Order2, req.user.id)
  const transaction = await sequelize.transaction()
  const transaction2 = await sequelize2.transaction()
  const cartItems = filteredBody.userId % 2 === 0 ? await Cart2.findAll({
    where: {
      userId: filteredBody.userId
    },
    transaction: transaction2
  }) :  await Cart.findAll({
    where: {
      userId: filteredBody.userId
    },
    transaction
  })

  if(cartItems.length === 0){
    return next(new AppError(`No items in the cart.`,400))
  }

  const order = filteredBody.userId % 2 === 0 ? await Order2.create(filteredBody,{
    transaction: transaction2
  }) : await Order.create(filteredBody,{
    transaction
  })
  let totalAmount = order.shippingFees
  
  
  for(const item of cartItems){
    const product = await Product.findByPk(item.productId,{transaction})
    const product2 = await Product2.findByPk(item.productId,{transaction:  transaction2})
    if(!product){
      return next(new AppError(`No product with this id.`,400))
    }
    const orderItemId = await getNewId(OrderItem, OrderItem2, req.user.id)
    const orderItem =  filteredBody.userId % 2 === 0 ? await OrderItem2.create({
      id: orderItemId,
      productId: product.id,
      quantity: item.quantity,
      price: product.price * item.quantity,
      orderId: order.id
    },{transaction: transaction2}) : await OrderItem.create({
      id: orderItemId,
      productId: product.id,
      quantity: item.quantity,
      price: product.price * item.quantity,
      orderId: order.id
    },{transaction})
    totalAmount += orderItem.price
    product.quantity -= orderItem.quantity
    product2.quantity -= orderItem.quantity
    await product.save({transaction})
    await product2.save({transaction2})
  }
  let finalTotalAmount = totalAmount

  if(filteredBody.voucherId){
    const voucher = filteredBody.userId % 2 === 0 ?  await Voucher2.findOne({
      include: [
        {
          model: User2,
          where: {
            id: filteredBody.userId 
          },
          through: {
            model: UserVoucher2,
            attributes: ['usageLimit']
          }
        }
      ],
      where: {
        [Op.and]: [{
          id: filteredBody.voucherId
        },
         { expiresAt: {
            [Op.gt]: new Date()
          }},
          {
          status: 'active'
          }]  
      },
      transaction: transaction2
    }) : await Voucher.findOne({
      include: [
        {
          model: User,
          where: {
            id: filteredBody.userId
          },
          through: {
            model: UserVoucher,
            attributes: ['usageLimit']
          }
        }
      ],
      where: {
        [Op.and]: [{
          id: filteredBody.voucherId
        },
         { expiresAt: {
            [Op.gt]: new Date()
          }},
          {
          status: 'active'
          }]  
      },
      transaction
    })
    if(!voucher){
        return next(new AppError("This voucher isn't valid")) 
    }
    
    if(!(voucher.voucherType === "fixedAmountDiscount" || voucher.voucherType === "referralDiscount") || voucher.minimumPurchaseAmount <= totalAmount-order.shippingFees){
      const [rowsAffected] = req.user.id % 2 === 0 ? await UserVoucher2.update({
        usageLimit: voucher.Users[0].UserVoucher.usageLimit -1
      },
      {
        transaction: transaction2,
        where: {
          userId: req.user.id,
          voucherId: req.body.voucherId,
          usageLimit: { [Op.gt]: 0 }
        }
      }) : await UserVoucher.update({
        usageLimit: voucher.Users[0].UserVoucher.usageLimit -1
      },
      {
        transaction,
        where: {
          userId: req.user.id,
          voucherId: req.body.voucherId,
          usageLimit: { [Op.gt]: 0 }
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
  filteredBody.userId % 2 === 0 ? await Cart2.destroy({
    where: {
      userId: filteredBody.userId
    },
    transaction: transaction2 
  }) : await Cart.destroy({
    where: {
      userId: filteredBody.userId
    },
    transaction
  })
  const paymentIntent = await createPaymentIntent(order.finalTotalAmount * 100,"egp")
  order.paymentIntentId = paymentIntent.id
  filteredBody.userId % 2 === 0 ? await order.save({transaction2}) : await order.save({transaction})
  await transaction.commit();
  await transaction2.commit();
  res.status(201).json({
    status:"success",
    data: {
      order,
      paymentIntent
    }})
})

exports.getFilteredOrders = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit 
  const filter = {
    [Op.and]: [
      req.query.status ?
      {status: req.query.status } : {},
      req.query.startDate || req.query.endDate  ?
      {createdAt: {
        [Op.and]: [
          req.query.startDate ? {[Op.gte]: req.query.startDate}: {},
          req.query.endDate ? {[Op.lte]: req.query.endDate}: {}
        ]
      }}: {}
    ]
  }
  console.log(filter)

  const orders1 = await Order.findAll({
    limit,
    offset,
    order: [['createdAt','DESC']],
    include: [
      {
        model: Product,
        attributes: ['id','name','price','imagesUrls'],
        through: {
          model: OrderItem,
          attributes: ['quantity']
        }
      }
    ],
    where: filter
  })

  const orders2 = await Order2.findAll({
    limit ,
    offset,
    order: [['createdAt','DESC']],
    include: [
      {
        model: Product2,
        attributes: ['id','name','price','imagesUrls'],
        through: {
          model: OrderItem2,
          attributes: ['quantity']
        }
      }
    ],
    where: filter
  })
  const orders = [...orders1, ...orders2]
  res.status(200).json({
    status: "success",
    data: {
      orders
    }
  })

})

exports.getOrderById = catchAsync(async (req, res, next) => {
  let order = await Order.findByPk(req.params.id,{
    include: [
      {
        model: Product,
        attributes: ['id','name','price','imagesUrls'],
        through: {
          model: OrderItem,
          attributes: ['quantity']
        }
      }
    ],
  })
  if(!order) {
    order = await Order2.findByPk(req.params.id,{
      include: [
        {
          model: Product2,
          attributes: ['id','name','price','imagesUrls'],
          through: {
            model: OrderItem2,
            attributes: ['quantity']
          }
        }
      ],
    })
  }
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


exports.updateOrder = catchAsync(async (req, res, next) => {
  if(!req.body.status){
    return next(new AppError("No data to update", 400))
  }
  let [rowsAffected, updatedRows] = await Order.update({
    status: req.body.status,
  },{
    where: {
      id: req.params.id
    },
    returning: true
  })
  if(rowsAffected === 0){
    [rowsAffected, updatedRows] = await Order2.update({
      status: req.body.status,
    },{
      where: {
        id: req.params.id
      },
      returning: true
    })
  }

  if(rowsAffected === 0 ){
    return next(new AppError('No order with this id!',404))
  }
  res.status(200).json({
    status: "success",
    data: {
      order: updatedRows[0]
    }
  })
})



exports.checkPaymentIntentAndConfirmOrder = catchAsync(async (req, res, next) => {
  const order = req.user.id % 2 === 0 ? await Order2.findOne({
    where: {
    id: req.params.id,
    userId: req.user.id
    },
    attributes: {
      include: ['paymentIntentId']
    }
  }) : await Order.findOne({
    where: {
    id: req.params.id,
    userId: req.user.id
  },
    attributes: {
      include: ['paymentIntentId']
    }
  })
  
  if(!order || order.userId !== req.user.id ){
    return next(new AppError('No order with this id!',404))
  }
  console.log(order.paymentIntentId)
  const paymentIntent = await retrievePaymentIntent(order.paymentIntentId)
  if(!paymentIntent){
    return next(new AppError('No payment intent to this order!',404))
  }
  if(paymentIntent.status === 'succeeded'){ 
    order.status = 'pending'
    await order.save()
  }
  res.status(200).json({
    status: "success",
    data: {
      order
    }
})
})