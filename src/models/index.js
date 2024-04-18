
const User = require('./User'); 
const Product = require('./Product')
const Order = require('./Order')
const Address = require('./Address')
const Cart = require('./Cart') 
const OrderItem = require('./OrderItem')
const Tag = require('./Tag')
const ProductTag = require('./ProductTag')
const UserVoucher = require('./UserVoucher')
const Wishlist = require('./Wishlist')
const Voucher = require('./Voucher')

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
// Order.hasMany(OrderItem, {
//     foreignKey: {
//         name: "orderId",
//         allowNull: false
//     },
// })
// OrderItem.belongsTo(Order, {
//     foreignKey: {
//         name: "orderId",
//         allowNull: false
//     },
// })
// Product.hasMany(OrderItem, {
//     foreignKey: {
//         name: "productId",
//         allowNull: false
//     },
// })
// OrderItem.belongsTo(Product, {
//     foreignKey: {
//         name: "productId",
//         allowNull: false
//     },
// })



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
// User.hasMany(Cart, {
//     foreignKey: {
//         name: "userId",
//         allowNull: false
//     },
// })
// Cart.belongsTo(User, {
//     foreignKey: {
//         name: "userId",
//         allowNull: false
//     },
// })
// Product.hasMany(Cart, {
//     foreignKey: {
//         name: "productId",
//         allowNull: false
//     },
// })
// Cart.belongsTo(Product, {
//     foreignKey: {
//         name: "productId",
//         allowNull: false
//     },
// })



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
// User.hasMany(WishList, {
//     foreignKey: {
//         name: "userId",
//         allowNull: false
//     },
// })
// WishList.belongsTo(User, {
//     foreignKey: {
//         name: "userId",
//         allowNull: false
//     },
// })
// Product.hasMany(WishList, {
//     foreignKey: {
//         name: "productId",
//         allowNull: false
//     },
// })
// WishList.belongsTo(Product, {
//     foreignKey: {
//         name: "productId",
//         allowNull: false
//     },
// })



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
  // Product.hasMany(ProductTag, {
  //   foreignKey: {
  //       name: 'productId',
  //       allowNull: false
  //   },
  // })
  // ProductTag.belongsTo(Product, {
  //   foreignKey: {
  //       name: 'productId',
  //       allowNull: false
  //   },
  // })
  // Tag.hasMany(ProductTag, {
  //   foreignKey: {
  //       name: 'tagId',
  //       allowNull: false
  //   },
  // })
  // ProductTag.belongsTo(Tag, {
  //   foreignKey: {
  //       name: 'tagId',
  //       allowNull: false
  //   },
  // })



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
  // User.hasMany(UserVoucher, {
  //   foreignKey: {
  //       name: "userId",
  //       allowNull: false
  //   },
  // })
  // UserVoucher.belongsTo(User, {
  //   foreignKey: {
  //       name: "userId",
  //       allowNull: false
  //   },
  // })
  // Voucher.hasMany(UserVoucher, {
  //   foreignKey: {
  //       name: "voucherId",
  //       allowNull: false
  //   },
  // })
  // UserVoucher.belongsTo(Voucher, {
  //   foreignKey: {
  //       name: "voucherId",
  //       allowNull: false
  //   },
  // })

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
    UserVoucher
  }