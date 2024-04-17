const {User, Order} = require("../models");
const catchAsync = require("../utils/catchAsync");

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