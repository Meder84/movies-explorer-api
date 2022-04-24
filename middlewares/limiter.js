const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Ограничить каждый IP до 100 запросов на «окно» (здесь за 15 минут)
  standardHeaders: true, // Информация об ограничении скорости возврата в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключает заголовки `X-RateLimit-*`
});

module.exports = limiter;
