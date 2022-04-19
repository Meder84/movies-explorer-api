class Unauthorized extends Error {
  constructor(message = 'Авторизация не прошла!') {
    super(message);
    this.message = message;
    this.name = 'Unauthorized';
    this.statusCode = 401;
  }
}

module.exports = Unauthorized;
