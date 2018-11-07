const jwt = require('jsonwebtoken');
const redis = require('redis');

//setup redis
const redisClient = redis.createClient(process.env.REDIS_URL); //default is localhost

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => user[0]) //this equivalent to user => Promise.resolve(user[0])
          .catch(err => Promise.reject('unable to get user'));
      } else {
        Promise.reject('wrong credentials');
      }
    })
    .catch(err => Promise.reject('wrong credentials'));
};

const getAuthTokenID = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized');
    }
    return res.json({ id: reply });
  }); //get value from redis
};

const signToken = email => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
  //this token contain the email information and expired in 2 days
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSession = user => {
  //JWT token
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => ({
      success: 'true',
      userId: id,
      token
    }))
    .catch(console.log);
  //returning only id and use this information to access guarded profile/:id end point
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers; //JWT token is passed in header object authorization property
  //if the user already have the token, they dont need to sign in
  return authorization
    ? getAuthTokenID(req, res)
    : handleSignin(db, bcrypt, req, res)
        .then(data => {
          return data.id && data.email
            ? createSession(data)
            : Promise.reject(data);
          //if data and email exist, createSession for user
        }) //then second parameter also can take care rejected case, just like catch
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err)); //throwing err is also a rejected promise
  //handleSignin is just a helper function and shouldnt resp
  //it should alway be end point function that resp
};
module.exports = {
  handleSignin: handleSignin,
  signinAuthentication: signinAuthentication,
  redisClient: redisClient
};
