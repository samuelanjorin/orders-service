/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
export default (sequelize, Sequelize) => {
  const orderDetailSchema = {
    item_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    attributes: {
      type: Sequelize.STRING,
      allowNull: false
    },
    product_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    quantity: {
      type: Sequelize.STRING,
      allowNull: false
    },
    unit_cost: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }
  const orderDetail = sequelize.define('order_detail', orderDetailSchema, {
    freezeTableName: true,
    timestamps: false
  })

  orderDetail.removeAttribute('id'),
  orderDetail.associate = db => {
    orderDetail.belongsTo(db.orders, {
      foreignKey: 'order_id',
      target: 'order_id',
      onDelete: 'CASCADE'
    })
  }

  return orderDetail
}
