const rateLimit = require ('express-rate-limit')

module.exports = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes in milliseconds
  max: 20,
  message: 'You have exceeded the 20 requests in 10 minutes limit!', 
  headers: false,
});

