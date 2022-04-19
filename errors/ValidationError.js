class ValidationError extends Error {
  constructor(message = 'Некорректные данные!') {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
