class SettingsRepository {
  constructor(SettingsModel) {
    this.Settings = SettingsModel;
  }

  async insertSettings(settingsItem) {
    // Insert assumes only one settings record is kept; adjust accordingly
    const result = await this.Settings.create({
      instagramUrl: settingsItem.insta,
      facebookUrl: settingsItem.fb,
      twitterUrl: settingsItem.xcom,
      youtubeUrl: settingsItem.youtube,
      defaultTaxPercentage: settingsItem.taxPercent,
      storeAddress: settingsItem.storeAddress.join(","),
      storeTimings: settingsItem.storeTimings.join(","),
      allowOrders: settingsItem.allowCheckout,
      storePhoneNumbers: settingsItem.storePhone.join(","),
      storeEmails: settingsItem.storeEmails.join(","),
      shippingText: settingsItem.shippingText,
      letCall: settingsItem.letCall,
      letChat: settingsItem.letChat,
    });
    return !!result;
  }

  async getSettings() {
    const record = await this.Settings.findOne();
    if (!record) return null;
    return this.mapToSettingsItem(record);
  }

  async updateSettings(settingsItem) {
    // Assuming a single settings record exists, you might update by primary key or criteria
    // Here we'll update all rows for simplicity (or add criteria as needed)
    const [updatedCount] = await this.Settings.update(
      {
        instagramUrl: settingsItem.insta,
        facebookUrl: settingsItem.fb,
        twitterUrl: settingsItem.xcom,
        youtubeUrl: settingsItem.youtube,
        defaultTaxPercentage: settingsItem.taxPercent,
        storeAddress: settingsItem.storeAddress.join(","),
        storeTimings: settingsItem.storeTimings.join(","),
        allowOrders: settingsItem.allowCheckout,
        storePhoneNumbers: settingsItem.storePhone.join(","),
        storeEmails: settingsItem.storeEmails.join(","),
        shippingText: settingsItem.shippingText,
        letCall: settingsItem.letCall,
        letChat: settingsItem.letChat,
      },
      {
        where: {}, // Add criteria if only one record should be updated (e.g., id)
      }
    );
    return updatedCount > 0;
  }

  // Helper to map DB record to domain SettingsItem object with arrays parsed back
  mapToSettingsItem(record) {
    return {
      insta: record.instagramUrl,
      fb: record.facebookUrl,
      xcom: record.twitterUrl,
      youtube: record.youtubeUrl,
      taxPercent: record.defaultTaxPercentage,
      storeAddress: record.storeAddress ? record.storeAddress.split(",") : [],
      storeTimings: record.storeTimings ? record.storeTimings.split(",") : [],
      allowCheckout: record.allowOrders,
      storePhone: record.storePhoneNumbers
        ? record.storePhoneNumbers.split(",")
        : [],
      storeEmails: record.storeEmails ? record.storeEmails.split(",") : [],
      shippingText: record.shippingText,
      letCall: record.letCall,
      letChat: record.letChat,
    };
  }
}

module.exports = SettingsRepository;
