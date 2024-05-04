const {User, Order, Wishlist, Product, Cart, Address} = require("../models");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");

exports.findAllUser = catchAsync(async (req,res,next)=> {
  const users = await User.findAll()
  console.log(users)
  res.status(200).json({
    status:"success",
    data: {
      users
    }
})
}
)

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user
    } 
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body,'name','phoneNumber','imageUrl')
  const [rowsAffected, updatedRows] = await User.update(filteredBody,{
    where: {
      id: req.user.id
    },
    returning: true
  })
  if(rowsAffected === 0){
    return next(new AppError("No data to update", 400))
  }
  res.status(200).json({
    status: "success",
    data: {
      user: updatedRows[0]
    }
})
})

exports.addPaymentMethod = catchAsync(async (req, res, next) => {
  if(!req.body.paymentMethodId){
    return next(new AppError(`You must add payment method id.`,400))
  }
  const user = await User.findByPk(req.user.id,{
   attributes: {
    include: ['paymentMethodsIds']
   }
  })
  user.paymentMethodsIds.push(req.body.paymentMethodI)
  await user.save()
  res.status(200).json({
    status: "success",
    data: {
      user
    }
})
})




// WISHLIST QUERIES

exports.addProductToWishlist = catchAsync(async (req, res, next) => {
  if(!req.body.productId){
    return next(new AppError(`You must add product id.`,400))
  }
  const wishlistItem = await Wishlist.create({
    userId: req.user.id,
    productId: req.body.productId
  })
  res.status(200).json({
    status:"success",
    data: {
      wishlistItem
    }
})
})

exports.removeProductFromWishlist = catchAsync(async (req, res, next) => {
  const wishlistItem = await Wishlist.destroy({
    where: {
    userId: req.user.id,
    productId: req.body.productId
    }
  })
  res.status(204).json({
    status: "success" 
  })
})

exports.getMyWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await Product.findAll({
    include: [
      {
        model: User,
        where: {
          id: req.user.id
        },
        through: {
          model: Wishlist,
          attributes: []
        }
      }
    ]
  })
  res.status(200).json({
    status:"success",
    data: {
      wishlist
    }
})
})

// CART QUERIES

exports.addProductToCart = catchAsync(async (req, res, next) => {
  if(!req.body.productId || !req.body.quantity){
    return next(new AppError(`You must add product id and quantity.`,400))
  }
  const product = await Product.findByPk(req.body.productId)
  if(product.quantity < req.body.quantity) {
    return next(new AppError(`You exceed the product quantity: ${product.quantity}.`,400))
  }
  const cartItem = await Cart.create({
    userId: req.user.id,
    productId: req.body.productId,
    quantity: req.body.quantity
  })
  res.status(200).json({
    status:"success",
    data: {
      cartItem
    }
})
})

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
  const cartItem = await Cart.destroy({
    where: {
    userId: req.user.id,
    productId: req.body.productId
    }
  })
  res.status(204).json({
    status: "success" 
  })
})

exports.getMyCart = catchAsync(async (req, res, next) => {
  const cart = await Product.findAll({
    include: [
      {
        model: User,
        where: {
          id: req.user.id
        },
        through: {
          model: Cart,
          attributes: ['quantity']
        }
      }
    ]
  })
  res.status(200).json({
    status:"success",
    data: {
      cart
    }
})
})

// ADDRESSES QUERIES

exports.getMyAddresses = catchAsync(async (req, res, next) => {
  const addresses = await Address.findAll({
    where: {
      userId: req.user.id
    }
  })

  res.status(200).json({
    status:"success",
    data: {
      addresses
    }
})


})


// ORDERS QUERIES

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.findAll({
    where: {
      userId: req.user.id
    },
    order: [['createdAt','DESC']]
  })

    res.status(200).json({
      status:"success",
      data: {
        orders
      }
  })
})

