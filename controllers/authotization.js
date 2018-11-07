const redisClient = require('./signin').redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json('Unauthorized'); //do not return next() if no authorization
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    console.log('you shall pass');
    return next(); //calling this will continue doing the next thing
  });
};

module.exports = {
  requireAuth: requireAuth
};
