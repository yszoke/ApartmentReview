const rateLimit = require ('express-rate-limit')

module.exports = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes in milliseconds
  max: 20,
  message: 'You have exceeded the 100 requests in 24 hrs limit!', 
  headers: false,
});

