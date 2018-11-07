const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

require('dotenv').config();
//environment variable, declare only at top level

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authotization');

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
  // connection: {
  //   //host: '127.0.0.1',
  //   host: process.env.POSTGRES_HOST,
  //   user: process.env.POSTGRES_USER,
  //   password: process.env.POSTGRES_PASSWORD,
  //   database: process.env.POSTGRES_DB
  // }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.send('it is working');
});
// app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/signin', signin.signinAuthentication(db, bcrypt));
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
}); //this are guarded end point
app.post('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
}); //this are guarded end point
app.put('/image', auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageurl', auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

//end point should be as modular as possible

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
