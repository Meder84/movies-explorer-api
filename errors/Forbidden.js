class Forbidden extends Error {
  constructor(message = 'Запрещено') { // У клиента нет прав доступа к содержимому.
    super(message);
    this.message = message;
    this.name = 'Forbidden';
    this.statusCode = 403;
  }
}

module.exports = Forbidden;
