const {User} = require('../models')
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const {randomBytes, scrypt} = require('crypto')
const {promisify} = require('util')

const scryptPromise = promisify(scrypt)


exports.signup = catchAsync(async (req,res,next)=>{
  
  // console.log(req)
  req.body.email = req.body.email.toLowerCase()

  
  const newUser = await User.create({
      name: req.body.name,
      email: req.body.email ,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber
  })

   const token = jwt.sign({id: newUser.id},"test-for-now",{
    expiresIn:'90d'
})
   
  res.status(201).json({
      status:"success",
      data: {
        token
      }
 })
})

exports.login = catchAsync(async (req,res,next)=> {
  req.body.email = req.body.email.toLowerCase()
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
    attributes: {
      include: ['password']
    }
  })
  if(!user){
   return next(new AppError(`Invalid Credentials`,401))
  }
  const [storedHash, salt] = user.password.split('.')
  const hash = await scryptPromise(req.body.password, salt, 32 );

  if(storedHash !== hash.toString('hex')){
    return next(new AppError(`Invalid Credentials`,401))
  }
  const token = jwt.sign({id: user.id},"test-for-now",{
    expiresIn:'90d'
})
   
  res.status(201).json({
      status:"success",
      data: {
        token
      }
 })

})

exports.protect = catchAsync(async (req, res, next) => {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
  }

  if(!token){
    return next(new AppError('You are not logged in!',401))
  } 

  const decoded = await promisify(jwt.verify)(token,"test-for-now")

  const currentUser = await User.findByPk(decoded.id)

  if(!currentUser) {
    return next(new AppError('The User belongs to this token does no longer exist.',401))
  }

  req.user = currentUser
  next()
})

exports.restrictTo =  (...roles) =>{
  return (req,res,next) => {
      if(!roles.includes(req.user.role)){
          return next(new AppError(`You don't have permission to perform this action.`,403))
      }
      next()
  }
}