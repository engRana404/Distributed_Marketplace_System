const {Product, ProductTag, Tag} = require('../models')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const filterObj = require('../utils/filterObj')
const sequelize = require('../config/database')
const { Op } = require('@sequelize/core');


exports.getFilteredProducts =  catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit
  const filter = {
    [Op.and]: [
      req.query.name ? {
        name: {
        [Op.like]: sequelize.literal(`'%${req.query.name}%'`)
      } 
    } : {},
    req.query.startPrice && req.query.endPrice ? {
        price: {
        [Op.and]: [
           {[Op.gte]: req.query.startPrice},
           {[Op.lte]: req.query.endPrice }
        ]
      }
    }: req.query.startPrice ? {
      price: {[Op.gte]: req.query.startPrice}
    }: req.query.endPrice ? {
      price: {[Op.lte]: req.query.endPrice }
    }:
    {}
    ]
  }
  let includeList = []
  if(req.query.tagsIds && JSON.parse(req.query.tagsIds).length > 0){
    console.log(JSON.parse(req.query.tagsIds)[0])
    includeList.push({
      model: Tag,
      attributes: ['id','name'],
      where: {
        id: {
          [Op.in]: JSON.parse(req.query.tagsIds)
        }
      },
      through: {
        attributes: []
      }
    })
  }
  const products = await Product.findAll({
    include: includeList,
    where: filter,
    limit,
    offset,
    order: [['createdAt','DESC']],
  })
  
  res.status(200).json({
    status:"success",
    data: {
      products
    }
  })
})

exports.createProduct = catchAsync(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  if(!req.body.tagsIds){
    return next(new AppError(`Product must have at least 1 tag`, 400))
  }
  const product = await Product.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    quantity: req.body.quantity,
    imagesUrls: req.body.imagesUrls
  },{transaction})
  console.log(product.id)
  for(let tagId of req.body.tagsIds) {
    await ProductTag.create({
      productId: product.id,
      tagId
    },{transaction})
  }
  await transaction.commit();
  res.status(201).json({
    status:"success",
    data: {
      product
    }
  })
})

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id,{
    include: [
      {
        model: Tag,
        attributes: ['id', 'name'],
        through: {
          attributes: []
        }
      }
    ]
  })
  res.status(200).json({
    status: "success",
    data: {
      product
    }
  })
})

exports.updateProduct = catchAsync(async (req, res, next) => {
  const transaction = await sequelize.transaction()
  const filteredBody = filterObj(req.body,'name', 'price', 'description', 'quantity', 'imagesUrls', 'tagsIds')
  
  if(Object.keys(filteredBody).length === 0){
    return next(new AppError("There's no data to update", 400))
  }
  
  const [rowsAffected, updatedRows] = await Product.update(filteredBody,{
    include: [
      {
        model: Tag,
        attributes: ['id', 'name'],
        through: {
          attributes: []
        }
      }
    ],
    where: {
      id: req.params.id
    },
    returning: true,
    transaction
  })
  if(rowsAffected === 0 && !filteredBody.tagsIds){
    return next(new AppError("No Product with this id!", 404))
  }
  if(filteredBody.tagsIds){
    for(let tagId of req.body.tagsIds) {
      await ProductTag.upsert({
        productId: req.params.id,
        tagId
      },{transaction})
    }
  }

  const product = updatedRows ? updatedRows[0] : await Product.findByPk(req.params.id,{
    transaction,
    include: [
      {
        model: Tag,
        attributes: ['id', 'name'],
        through: {
          attributes: []
        }
      }
    ]
  })
  
  await transaction.commit();

  res.status(200).json({
    status: "success",
    data: {
      product
    }
  })
})

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const deletedProduct = await Product.destroy({
    where: {
      id: req.params.id
    }
  })
 if(!deletedProduct) {
  return next(new AppError("No Product with this id!", 404))

 }
  res.status(204).json({
    status: "success" 
  })
})