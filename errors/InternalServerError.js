const { internalServerError } = require('../utils/errors');

class InternationalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = internalServerError;
  }
}
module.exports = InternationalServerError;
