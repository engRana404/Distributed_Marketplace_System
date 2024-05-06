
const {User,User2} = require('./User'); 
const {Product,Product2} = require('./Product')
const {Voucher, Voucher2} = require('./Voucher')
const {Address,Address2} = require('./Address')
const {Order,Order2} = require('./Order')
const {Cart,Cart2} = require('./Cart') 
const {OrderItem,OrderItem2} = require('./OrderItem')
const {Tag,Tag2} = require('./Tag')
const {ProductTag,ProductTag2} = require('./ProductTag')
const {UserVoucher,UserVoucher2} = require('./UserVoucher')
const {Wishlist, Wishlist2} = require('./Wishlist')


User.hasMany(Address, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});
Address.belongsTo(User,{
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})



User.hasMany(Order, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
})
Order.belongsTo(User,{
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
})



Address.hasMany(Order, {
    foreignKey: {
        name: "addressId",
        allowNull: false,
    },
})
Order.belongsTo(Address, {
    foreignKey: {
        name: "addressId",
        allowNull: false,
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
})



Voucher.hasMany(Order, {
    foreignKey: {
        name: "voucherId",
        allowNull: true
    },
})
Order.belongsTo(Voucher, {
    foreignKey: {
        name: "voucherId",
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
})



Order.belongsToMany(Product, {
    through: OrderItem,
    foreignKey: {
        name: "orderId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"

})
Product.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: {
        name: "productId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})



User.belongsToMany(Product, {
    through: Cart,
    foreignKey: {
        name: "userId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})
Product.belongsToMany(User, {
    through: Cart,
    foreignKey: {
        name: "productId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})



User.belongsToMany(Product, {
    through: Wishlist,
    foreignKey: {
        name: "userId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})
Product.belongsToMany(User, {
    through: Wishlist,
    foreignKey: {
        name: "productId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})



Product.belongsToMany(Tag, {
    through: ProductTag,
    foreignKey: {
        name: 'productId',
        allowNull: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', 
  });
  Tag.belongsToMany(Product, {
    through: ProductTag,
    foreignKey: {
        name: 'tagId',
        allowNull: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });



  User.belongsToMany(Voucher, {
    through: UserVoucher,
    foreignKey: {
        name: "userId",
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  Voucher.belongsToMany(User, {
    through: UserVoucher,
    foreignKey: {
        name: "voucherId",
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })


  User2.hasMany(Address2, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});
Address2.belongsTo(User2,{
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})



User2.hasMany(Order2, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
})
Order2.belongsTo(User2,{
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
})



Address2.hasMany(Order2, {
    foreignKey: {
        name: "addressId",
        allowNull: false,
    },
})
Order2.belongsTo(Address2, {
    foreignKey: {
        name: "addressId",
        allowNull: false,
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
})



Voucher2.hasMany(Order2, {
    foreignKey: {
        name: "voucherId",
        allowNull: true
    },
})
Order2.belongsTo(Voucher2, {
    foreignKey: {
        name: "voucherId",
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
})



Order2.belongsToMany(Product2, {
    through: OrderItem2,
    foreignKey: {
        name: "orderId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"

})
Product2.belongsToMany(Order2, {
    through: OrderItem2,
    foreignKey: {
        name: "productId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})



User2.belongsToMany(Product2, {
    through: Cart2,
    foreignKey: {
        name: "userId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})
Product2.belongsToMany(User2, {
    through: Cart2,
    foreignKey: {
        name: "productId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})



User2.belongsToMany(Product2, {
    through: Wishlist2,
    foreignKey: {
        name: "userId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})
Product2.belongsToMany(User2, {
    through: Wishlist2,
    foreignKey: {
        name: "productId",
        allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})



Product2.belongsToMany(Tag2, {
    through: ProductTag2,
    foreignKey: {
        name: 'productId',
        allowNull: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', 
  });
  Tag2.belongsToMany(Product2, {
    through: ProductTag2,
    foreignKey: {
        name: 'tagId',
        allowNull: true
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });



  User2.belongsToMany(Voucher2, {
    through: UserVoucher2,
    foreignKey: {
        name: "userId",
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  Voucher2.belongsToMany(User2, {
    through: UserVoucher2,
    foreignKey: {
        name: "voucherId",
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })

  module.exports = {
    User,
    Product,
    Order,
    Address,
    Tag,
    Voucher,
    Wishlist,
    Cart,
    ProductTag,
    OrderItem,
    UserVoucher,
    User2,
    Product2,
    Order2,
    Address2,
    Tag2,
    Voucher2,
    Wishlist2,
    Cart2,
    ProductTag2,
    OrderItem2,
    UserVoucher2
  }