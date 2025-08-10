const addressRepository = require("../repositories/addressRepository");

class AddressService {
  /**
   * Get all addresses for a user
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async getAddresses(userId) {
    return addressRepository.getAddresses(userId);
  }

  /**
   * Get address by ID
   * @param {number} addressId
   * @returns {Promise<Object|null>}
   */
  async getAddressById(addressId) {
    return addressRepository.getAddressById(addressId);
  }

  /**
   * Create a new address
   * @param {number} userId
   * @param {Object} createAddressRequest (expects keys: name, phone, address, city, state, pincode, country)
   * @returns {Promise<number>} new address id
   */
  async createAddress(userId, createAddressRequest) {
    const { name, phone, address, city, state, pincode, country } =
      createAddressRequest;
    return addressRepository.insertAddress({
      userId,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      country,
    });
  }

  /**
   * Update an existing address
   * @param {number} userId
   * @param {Object} updateAddressRequest (expects keys: id, name, phone, address, city, state, pincode, country)
   * @returns {Promise<boolean>}
   */
  async updateAddress(userId, updateAddressRequest) {
    const { id, name, phone, address, city, state, pincode, country } =
      updateAddressRequest;
    return addressRepository.updateAddress({
      id,
      userId,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      country,
    });
  }

  /**
   * Delete address by ID
   * @param {number} addressId
   * @returns {Promise<boolean>}
   */
  async deleteAddress(addressId) {
    return addressRepository.deleteAddress(addressId);
  }
}

module.exports = new AddressService();
