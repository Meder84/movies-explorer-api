// eslint-disable-next-line import/newline-after-import
const { isCelebrateError } = require('celebrate');
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  console.log(err.stack || err);

  if (isCelebrateError(err)) {
    const [error] = err.details.values();
    return res.status(400).send({ message: error.message });
  }
  res.status(status).send({
    message: err.message,
  });
  return next();
};

module.exports = errorHandler;
