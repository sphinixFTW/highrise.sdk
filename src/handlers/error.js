/**
 * Error class for Highrise API errors.
 * @class
 * @extends Error
 * @param {string} message - The error message.
*/
class HighriseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HighriseError';
  }
}

class AuthenticationError extends HighriseError {
  /**
   * @class AuthenticationError
   * Represents an authentication error in the Highrise package.
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class WebApiError extends HighriseError {
  /**
   * @class WebApiError
   * Represents an WebApiError error in the Highrise package.
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
    this.name = 'WebApiError';
  }
}


module.exports = {
  HighriseError,
  AuthenticationError,
  WebApiError
}