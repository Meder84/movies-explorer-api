class ErrorConflict extends Error {
  constructor(message = 'Произошел конфликт!') {
    super(message);
    this.message = message;
    this.name = 'ErrorConflict';
    this.statusCode = 409;
  }
}

module.exports = ErrorConflict;
