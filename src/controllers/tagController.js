const {Tag} = require('../models')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const sequelize = require('../config/database')
const { Op } = require('@sequelize/core');


exports.createTag = catchAsync(async (req, res, next) => {
  const tag = await Tag.create({
    name: req.body.name
  })
  res.status(201).json({
    status: "success",
    data: {
      tag
    }
  })
})

exports.getFilteredTags = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit
  const filter = {
    // name: req.query.name ? {
    //   [sequelize.op.like]: sequelize.literal(`'%${req.query.name}%'`)
    // }: undefined
  }
  if(req.query.name) { 
    filter.name = {[Op.like]: sequelize.literal(`'%${req.query.name}%'`)}
  }

  const tags = await Tag.findAll({
    where: filter,
    limit,
    offset,
    order: [["name", "ASC"]]
  })
  
  res.status(200).json({
    status: "success",
    data : {
      tags
    }
  })
})

exports.getTagById = catchAsync(async (req, res, next) => {
  const tag = await Tag.findByPk(req.params.id)
  if(!tag) {
    return next(new AppError('No tag with this id!',404))
  }
  res.status(200).json({
    status: "success",
    data : {
      tag
    }
  })
})

exports.updateTag = catchAsync(async (req, res, next) => {
  const name = req.body.name
  const [rowsAffected, updatedRows] = await Tag.update({name},{
    where: {
      id: req.params.id
    },
    returning: true
  })
  if(rowsAffected === 0){
    return next(new AppError("No tag with this id!", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      tag: updatedRows[0]
    }
  })
})

exports.deleteTag = catchAsync(async (req, res, next) => {
  const deletedTag = await Tag.destroy({
    where: {
      id: req.params.id
    }
  })

  if(!deletedTag) {
    return next(new AppError("No tag with this id!", 404))
  }

  res.status(204).json({
    status: "success" 
  })
})