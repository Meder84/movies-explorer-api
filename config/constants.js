const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const SALT_ROUNDS = 10;
const regexLink = /(http|https):\/\/([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/;

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  regexLink,
  SALT_ROUNDS,
};
