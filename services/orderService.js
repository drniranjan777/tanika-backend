// services/orderService.js
const { DataNotFound, InvalidRequest, InvalidUserOrder } = require("../errors");

class OrderService {
  constructor({
    orderRepository,
    cartRepository,
    pageUtils,
    validator,
    userRepository,
    payGateway,
    settingsRepository,
    addressRepository,
  }) {
    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
    this.pageUtils = pageUtils;
    this.validator = validator;
    this.userRepository = userRepository;
    this.payGateway = payGateway;
    this.settingsRepository = settingsRepository;
    this.addressRepository = addressRepository;
  }

  generateOrderNumber() {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, "0");
    return `${String(now.getFullYear()).slice(-2)}${pad(
      now.getMonth() + 1
    )}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`;
  }

  async getStats(start, end) {
    const month = await this.orderRepository.ordersThisMonth();
    const total = await this.orderRepository.totalNumberOfOrders();
    const week = await this.orderRepository.ordersThisWeek();
    const today = await this.orderRepository.ordersToday();
    const stats = await this.orderRepository.getOrderStats(start, end);

    return { month, total, week, today, stats };
  }

  async createOrder(userId, request) {
    await this.validator.validateCreateOrder(request);

    const settings = await this.settingsRepository.getSettings();
    if (settings && settings.allowCheckout === false) {
      throw new InvalidRequest(
        "Checkout Restricted at the moment, please retry later."
      );
    }

    const products = await this.cartRepository.getAllItems(userId);
    if (products.length === 0) {
      throw new InvalidRequest("Cart is empty");
    }

    const total = products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const orderSeries = this.generateOrderNumber();

    const user = await this.userRepository.getUserOrNull(userId);
    if (!user) throw new InvalidUserOrder();

    const { orderId, updatedOrderNo } = await this.orderRepository.createOrder({
      createdDate: new Date(),
      orderNo: orderSeries,
      orderTotal: total,
      discount: 0.0,
      discountType: "",
      billingAddress: request.billingAddress,
      shippingAddress: request.shippingAddress,
      additionalComments: request.additionalComments,
      orderStatus: "FAILED", // string enum; adjust if needed
      lastUpdate: new Date(),
      userID: userId,
      completedTime: null,
      billingName: request.billingName,
      shippingName: request.shippingName,
      billingMobile: request.billingMobile,
      shippingMobile: request.shippingMobile,
      products,
    });

    const gatewayAmountInSmallestUnit = total * 100; // for INR paise
    const orderIdAndUser = JSON.stringify({
      orderId,
      orderNumber: updatedOrderNo,
      user,
    });

    const gatewayId = await this.payGateway.createOrder(
      gatewayAmountInSmallestUnit,
      updatedOrderNo,
      orderId,
      orderIdAndUser
    );

    return {
      id: orderId,
      orderNo: updatedOrderNo,
      gatewayResponse: gatewayId,
      status: true,
    };
  }

  async setOrderSuccess(userId, request) {
    await this.validator.validateConfirmOrder(request);

    const order = await this.orderRepository.getOrderItem(request.id);
    if (!order) throw new DataNotFound("Order not found");

    if (order.userID !== userId) {
      throw new InvalidRequest("No privileges to complete order.");
    }

    const attributes = {
      orderCreationId: request.orderCreationId,
      razorpayPaymentId: request.razorpayPaymentId,
      razorpayOrderId: request.razorpayOrderId,
      razorpaySignature: request.razorpaySignature,
    };

    const isValid = await this.payGateway.verifyOrder(attributes);
    if (!isValid) {
      throw new InvalidRequest("Failed to verify payment.");
    }

    await this.orderRepository.updateOrderStatus(
      "PLACED",
      null,
      request.razorpayPaymentId,
      request.id
    );
    await this.cartRepository.deleteAll(userId);

    return { status: true };
  }

  async getOrders(query, page, userId) {
    const offset = this.pageUtils.toOffset(page);
    let orders, count;

    if (userId != null) {
      if (query != null) {
        orders = await this.orderRepository.findOrder(query, offset);
        count = await this.orderRepository.findOrderCount(query);
      } else {
        orders = await this.orderRepository.getOrdersByUser(offset, userId);
        count = await this.orderRepository.getOrdersCountByUser(userId);
      }
    } else {
      orders = await this.orderRepository.getOrders(offset);
      count = await this.orderRepository.getOrdersCount();
    }

    return this.pageUtils.create(count, orders);
  }

  async getOrder(orderId, userId) {
    const orderItem = await this.orderRepository.getOrderItem(orderId);
    if (!orderItem) throw new DataNotFound();

    if (userId && orderItem.userID !== userId) {
      throw new DataNotFound();
    }

    const products = await this.orderRepository.getOrderProducts(orderId);
    const customer = await this.userRepository.getUserById(orderItem.userID);

    return {
      products,
      order: orderItem,
      customer,
    };
  }

  async getPreviousAddress(userId) {
    const addresses = await this.addressRepository.getAddresses(userId);
    return addresses.map((addr) => ({
      shippingName: addr.name,
      shippingAddress: `${addr.address} ${addr.city} ${addr.state} - ${addr.pincode}, ${addr.country}`,
      shippingNumber: addr.phone,
    }));
  }

  async changeOrderStatus(request) {
    const data = request.data(this.validator);
    const status = request.status; // Assume string enum passed here.

    const date = status === "DELIVERED" ? new Date() : null;

    const result = await this.orderRepository.updateOrderStatus(
      status,
      date,
      null,
      data.id
    );

    return { status: result };
  }
}

module.exports = OrderService;
