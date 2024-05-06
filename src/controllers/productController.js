const {Product, ProductTag, Tag, Product2, ProductTag2, Tag2} = require('../models')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const filterObj = require('../utils/filterObj')
const {sequelize, sequelize2} = require('../config/database')
const { Op } = require('@sequelize/core');
const multer = require('multer')
const s3 = require('../utils/s3')


const multerStorage = multer.memoryStorage()
const multerFilter = (req,file,cb) =>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{ 
       return cb(new AppError('Not an image! Please upload only images.',400))
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadProductPhotos = upload.array('photos')
exports.uploadProductPhotosToS3 = catchAsync(async (req,res,next) => {
    console.log(req.files)
    if(!req.files){
        return next(new AppError(`No image to upload`,400))
    }
    if(!req.product.imagesUrls){
    req.product.imagesUrls = []
    req.product2.imagesUrls = []
    }
    for(let i = 0 ; i < req.files.length ; i++){
        req.files[i].filename = `images/products/product-${req.product.id}-${i+1}.png`
        // req.files[i].buffer =  await sharp(req.files[i].buffer)
        // .toFormat('png')
        // .png({ quality: 90})
        // .toBuffer()
        const result =  await s3.uploadFile(req.files[i],'image/png')
        console.log('the s3 result '+ result)
        req.product.imagesUrls.push(result)
        req.product2.imagesUrls.push(result)
    }
    await req.product.save()
    await req.product2.save()
    res.status(201).json({
      status:"success",
      data: {
        product: req.product
      }
    })
}
)


exports.getFilteredProducts =  catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit
  const filter = {
    [Op.and]: [
      req.query.name ? {
        name: {
        [Op.iLike]: sequelize.literal(`'%${req.query.name}%'`)
      } 
    } : {},
    req.query.sizes ? {
      sizes : {
        [Op.contains]:  req.query.sizes.split(',')
      }
    }: {},
    req.query.colorsList ? {
      colorsList : {
        [Op.contains]: req.query.colorsList.split(',')
      }
    }: {},
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

  console.log(filter)
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
  const transaction2 = await sequelize2.transaction()
  const filteredBody = filterObj(req.body,'name', 'price', 'description', 'quantity','sizes','colorsList')
  if(!req.body.tagsIds){
    return next(new AppError(`Product must have at least 1 tag`, 400))
  }
  console.log(filteredBody.price)
  const product = await Product.create(filteredBody,{transaction})
  const product2 = await Product2.create(filteredBody,{transaction: transaction2})
  console.log(req.body.tagsIds)
  for(let tagId of req.body.tagsIds) {
    await ProductTag.create({
      productId: product.id,
      tagId
    },{transaction})

    await ProductTag2.create({
      productId: product2.id,
      tagId
    },{transaction: transaction2})
  }
  await transaction.commit();
  await transaction2.commit();
  req.product = product
  req.product2 = product2
  next()
  
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
  const transaction2 = await sequelize2.transaction()
  const filteredBody = filterObj(req.body,'name', 'price', 'description', 'quantity','colorsList','sizes')
  
  if(Object.keys(filteredBody).length === 0 && !req.body.tagsIds){
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

  const [rowsAffected2, updatedRows2] = await Product2.update(filteredBody,{
    include: [
      {
        model: Tag2,
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
    transaction: transaction2
  })
  if(rowsAffected === 0 && !req.body.tagsIds){
    return next(new AppError("No Product with this id!", 404))
  }
  if(req.body.tagsIds){
    for(let tagId of req.body.tagsIds) {
      await ProductTag.upsert({
        productId: req.params.id,
        tagId
      },{transaction})

      await ProductTag2.upsert({
        productId: req.params.id,
        tagId
      },{transaction: transaction2})
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
  await transaction2.commit();

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
  const deletedProduct2 = await Product2.destroy({
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