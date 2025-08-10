const UserRepository = require("../repositories/userRepository");
const OrderRepository = require("../repositories/orderRepository");
const WishlistRepository = require("../repositories/wishlistRepository");
const UIRepository = require("../repositories/uiRepository");
const CartRepository = require("../repositories/cartRepository");
const SettingsRepository = require("../repositories/settingsRepository");

const UserService = require("../services/userService");
const OrderService = require("../services/orderService");
const WishlistService = require("../services/wishlistService");
const UIService = require("../services/UIService");
const SettingsService = require("../services/settingsService");

const StorageDriver = require("../utils/storageDriver");
const Validator = require("../validators/validator");
const PageUtils = require("../utils/pagingUtils");

const container = {
  repositories: {
    orderRepository: new OrderRepository(20 /* config */),
    wishlistRepository: new WishlistRepository(20 /* config */),
    uiRepository: new UIRepository(/* config */),
  },
  services: {},
  utils: {
    storageDriver: StorageDriver,
    validator: Validator,
    pageUtils: new PageUtils(),
  },
};

// Inject repositories and utils into services
container.services.orderService = new OrderService({
  orderRepository: container.repositories.orderRepository,
  cartRepository: container.repositories.cartRepository,
  pageUtils: container.utils.pageUtils,
  validator: container.utils.validator,
  userRepository: container.repositories.userRepository,
  settingsRepository: container.repositories.settingsRepository,
  addressRepository: container.repositories.addressRepository,
});

container.services.wishlistService = new WishlistService({
  wishlistRepository: container.repositories.wishlistRepository,
  pageUtils: container.utils.pageUtils,
});

container.services.uiService = new UIService({
  uiRepository: container.repositories.uiRepository,
  validator: container.utils.validator,
  storageDriver: container.utils.storageDriver,
});

container.services.settingsService = new SettingsService({
  settingsRepository: container.repositories.settingsRepository,
  validator: container.utils.validator,
  key: process.env.SOME_KEY,
});

module.exports = container;
