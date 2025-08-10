const { Op, fn, col, where, literal } = require("sequelize");
const { Order, OrderProduct, User, Product, SizeOption } = require("../models");
const { Sequelize } = require("sequelize");

class OrderRepository {
  constructor(perPage) {
    this.perPage = perPage;
  }

  async getOrders(offset = 0) {
    return Order.findAll({
      offset,
      limit: this.perPage,
      order: [["createdDate", "DESC"]],
      include: [{ model: User, attributes: ["id", "name", "phoneNumber"] }],
    });
  }

  async findOrderCount(query) {
    return Order.count({
      where: {
        [Op.or]: [{ orderNo: { [Op.like]: `%${query}%` } }, { orderNo: query }],
      },
      include: [
        {
          model: User,
          where: {
            [Op.or]: [
              { phoneNumber: { [Op.like]: `%${query}%` } },
              { name: { [Op.like]: `%${query}%` } },
            ],
          },
          required: false,
        },
      ],
    });
  }

  async findOrder(query, offset = 0) {
    return Order.findAll({
      offset,
      limit: this.perPage,
      include: [
        {
          model: User,
          where: {
            [Op.or]: [
              { phoneNumber: { [Op.like]: `%${query}%` } },
              { name: { [Op.like]: `%${query}%` } },
            ],
          },
          required: false,
        },
      ],
      where: {
        [Op.or]: [{ orderNo: { [Op.like]: `%${query}%` } }, { orderNo: query }],
      },
      order: [["createdDate", "DESC"]],
    });
  }

  async getSavedAddress(userID) {
    return Order.findOne({
      where: { userID },
      order: [["createdDate", "DESC"]],
      attributes: [
        "billingAddress",
        "billingName",
        "billingMobile",
        "shippingAddress",
        "shippingName",
        "shippingMobile",
      ],
    });
  }

  async createOrder({
    createdDate,
    orderNo,
    orderTotal,
    discount,
    discountType,
    billingAddress,
    billingName,
    billingMobile,
    shippingAddress,
    shippingName,
    shippingMobile,
    additionalComments,
    orderStatus,
    lastUpdate,
    userID,
    completedTime,
    products,
    gatewayOrderID,
  }) {
    // Create order transactionally
    const order = await sequelize.transaction(async (t) => {
      const createdOrder = await Order.create(
        {
          orderNo,
          orderTotal,
          discount,
          discountType,
          billingAddress,
          billingName,
          billingMobile,
          shippingAddress,
          shippingName,
          shippingMobile,
          additionalComments,
          orderStatus: orderStatus.ordinal, // assuming enum mapping or store string
          lastUpdate,
          userID,
          completedTime,
          gatewayOrderID,
        },
        { transaction: t }
      );

      const orderId = createdOrder.id;

      // Batch insert products
      const orderProducts = products.map((product) => ({
        orderId,
        productId: product.product.id,
        productDiscount: product.product.discount,
        qty: product.quantity,
        sizeID: product.size.id,
        price: product.product.price,
        taxInfo: 0.0,
      }));

      await OrderProduct.bulkCreate(orderProducts, { transaction: t });

      // Update order number appending orderId
      const updatedOrderNo = `${orderNo}${orderId}`;
      await createdOrder.update(
        { orderNo: updatedOrderNo },
        { transaction: t }
      );

      return { orderId, updatedOrderNo };
    });

    return order;
  }

  async updateOrderStatus({ status, completed, gatewayOrderID, id }) {
    const updateData = {
      orderStatus: status.ordinal, // adjust if using strings
    };
    if (completed) updateData.completedTime = completed;
    if (gatewayOrderID) updateData.gatewayOrderID = gatewayOrderID;

    const [updatedRows] = await Order.update(updateData, {
      where: { id },
    });
    return updatedRows > 0;
  }

  async getOrdersByUser(offset = 0, userID) {
    return Order.findAll({
      where: { userID },
      offset,
      limit: this.perPage,
      order: [["createdDate", "DESC"]],
    });
  }

  async getOrdersCount() {
    return Order.count();
  }

  async getOrdersCountByUser(userID) {
    return Order.count({ where: { userID } });
  }

  async getOrderItem(orderId) {
    return Order.findOne({ where: { id: orderId } });
  }

  async getOrderProducts(orderId) {
    return OrderProduct.findAll({
      where: { orderId },
      include: [{ model: Product }, { model: SizeOption }],
    });
  }

  async totalNumberOfOrders() {
    return Order.count();
  }

  async ordersThisMonth() {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    return Order.count({
      where: {
        createdDate: { [Op.gte]: startOfMonth },
      },
    });
  }

  async ordersThisWeek() {
    const now = new Date();
    const day = now.getDay(); // Sunday - Saturday : 0 - 6
    const diffToMonday = day === 0 ? 6 : day - 1; // calculate Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    return Order.count({
      where: {
        createdDate: { [Op.gte]: monday },
      },
    });
  }

  async ordersToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Order.count({
      where: {
        createdDate: { [Op.gte]: today },
      },
    });
  }

  async getOrderStats(startDate, endDate) {
    // Aggregate count grouped by createdDate (date only)
    return Order.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdDate")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      where: {
        createdDate: { [Op.between]: [startDate, endDate] },
      },
      group: [Sequelize.fn("DATE", Sequelize.col("createdDate"))],
    });
  }
}

module.exports = OrderRepository;
