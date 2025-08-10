class Validator {
  constructor() {
    // Email regex similar to your Kotlin version
    this.emailRegex =
      /^[a-zA-Z0-9+._%\-+]{1,256}@[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}(\.[a-zA-Z0-9][a-zA-Z0-9\-]{0,25})+$/;
  }

  validateEmail(email) {
    return this.emailRegex.test(email);
  }

  validatePassword(password) {
    return this.between(password, [8, 25]);
  }

  between(value, range) {
    if (typeof value === "string" || Array.isArray(value)) {
      return value.length >= range[0] && value.length <= range[1];
    }
    if (typeof value === "number") {
      return value >= range[0] && value <= range[1];
    }
    return false;
  }

  allowRange(value, ...allowedValues) {
    return allowedValues.includes(value);
  }
}

module.exports = Validator;
