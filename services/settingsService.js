const settingsRepository = require("../repositories/settingsRepository");
const validator = require("../validators/settingsValidator");

// class SettingsService {
//   /**
//    * @param {Object} options
//    * @param {Object} options.settingsRepository - instance with getSettings, insertSettings, updateSettings methods
//    * @param {Object} options.validator - instance with async validate(request) method
//    * @param {string} options.key - config key to attach to settings response
//    */
//   constructor({ settingsRepository, validator, key }) {
//     settingsRepository = settingsRepository;
//     validator = validator;
//     key = key;
//   }

async function getSettings() {
  let settingItem = await settingsRepository.getSettings();
  if (!settingItem) {
    settingItem = {
      insta: null,
      fb: null,
      xcom: null,
      youtube: null,
      taxPercent: 0.0,
      storeAddress: [],
      storeTimings: [],
      allowCheckout: true,
      storePhone: [],
      storeEmails: [],
      shippingText: null,
      letCall: null,
      letChat: null,
    };
  }
  return {
    key: key,
    settings: settingItem,
  };
}

async function saveSettings(request) {
  await validator.validate(request);
  const existing = await settingsRepository.getSettings();

  let result = false;
  if (!existing) {
    result = await settingsRepository.insertSettings(request.settings);
  } else {
    result = await settingsRepository.updateSettings(request.settings);
  }
  return { status: result };
}

module.exports = {
  getSettings,
  saveSettings,
};
