const {User, Order, Wishlist, Product, Cart, Address, User2, Order2, Wishlist2, Product2, Cart2, Address2, OrderItem, OrderItem2, Voucher2, UserVoucher2, Voucher, UserVoucher} = require("../models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");
const { getNewId } = require("../utils/getNewId");

exports.findAllUser = catchAsync(async (req,res,next)=> {
  const users1 = await User.findAll()
  const users2 = await User2.findAll()
  const users = [...users1, ...users2]
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

  const filteredBody = filterObj(req.body,'name','phoneNumber')
  const [rowsAffected, updatedRows] = req.user.id % 2 === 0 ? await User2.update(filteredBody,{
    where: {
      id: req.user.id
    },
    returning: true
  }) : await User.update(filteredBody,{
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

exports.setAdmin = catchAsync(async (req, res, next) => {
  const [rowsAffected, updatedRows] = req.params.id % 2 === 0 ? await User2.update({
    role: 'admin'
  },{
    where: {
      id: req.params.id
    },
    returning: true
  }) : await User.update({
    role: 'admin'
  },{
    where: {
      id: req.params.id
    },
    returning: true
  })
  if(rowsAffected === 0){
    return next(new AppError("No User with this id!", 404))
  }
  res.status(200).json({
    status: "success",
    data: {
      user: updatedRows[0]
    }
  })

})




// WISHLIST QUERIES

exports.addProductToWishlist = catchAsync(async (req, res, next) => {
  if(!req.body.productId){
    return next(new AppError(`You must add product id.`,400))
  }
  const id = await getNewId(Wishlist, Wishlist2, req.user.id)
  const wishlistItem = req.user.id % 2 === 0 ? await Wishlist2.create({
    id,
    userId: req.user.id,
    productId: req.body.productId
  }) : await Wishlist.create({
    id,
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
  const wishlistItem = req.user.id % 2 === 0 ? await Wishlist2.destroy({
    where: {
    userId: req.user.id,
    productId: req.params.productId
    }}) :  await Wishlist.destroy({
    where: {
    userId: req.user.id,
    productId: req.params.productId
    }
  })
  res.status(204).json({
    status: "success" 
  })
})

exports.getMyWishlist = catchAsync(async (req, res, next) => {
  const wishlist = req.user.id % 2 === 0 ? await Product2.findAll({
    include: [
      {
        model: User2,
        where: {
          id: req.user.id
        },
        through: {
          model: Wishlist2,
          attributes: []
        }
      }
    ]
  }) :  await Product.findAll({
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
  if(!product){
    return next(new AppError(`No product with tthis id.`,404))
  }
  if(product.quantity < req.body.quantity) {
    return next(new AppError(`You exceed the product quantity: ${product.quantity}.`,400))
  }
  const id = await getNewId(Cart, Cart2, req.user.id)
  const cartItem = req.user.id % 2 === 0 ? await Cart2.create({
    id,
    userId: req.user.id,
    productId: req.body.productId,
    quantity: req.body.quantity
  }) :  await Cart.create({
    id,
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
  const cartItem = req.user.id % 2 === 0 ? await Cart2.destroy({
    where: {
    userId: req.user.id,
    productId: req.params.productId
    }
  }) : await Cart.destroy({
    where: {
    userId: req.user.id,
    productId: req.params.productId
    }
  })
  res.status(204).json({
    status: "success" 
  })
})

exports.getMyCart = catchAsync(async (req, res, next) => {
  const cart = req.user.id % 2 === 0 ? await Product2.findAll({
    include: [
      {
        model: User2,
        where: {
          id: req.user.id
        },
        through: {
          model: Cart2,
          attributes: ['quantity']
        }
      }
    ]
  }) : await Product.findAll({
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
  const addresses = req.user.id % 2 === 0 ? await Address2.findAll({
    where: {
      userId: req.user.id
    }
  }) : await Address.findAll({
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
  const orders = req.user.id % 2 === 0 ? await Order2.findAll({
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
    where: {
      userId: req.user.id
    },
    order: [['createdAt','DESC']]
  }) :  await Order.findAll({
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


/// VOUCHERS QUERIES

exports.getMyVouchers = catchAsync(async (req, res, next) => {
  const vouchers = req.user.id % 2 === 0 ? await Voucher2.findAll({
    include: [
      {
        model: User2,
        where: {
          id: req.user.id
        },
        through: {
          model: UserVoucher2,
          attributes: ['usagelimit']
        }
      }
    ]
  }) : await Voucher.findAll({
    include: [
      {
        model: User,
        where: {
          id: req.user.id
        },
        through: {
          model: UserVoucher,
          attributes: ['usageLimit']
        }
      }
    ]
  })

  res.status(200).json({
    status:"success",
    data: {
      vouchers
    }
})
})

