import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import config from './config';

const dbSchema = new mongoose.Schema({
  email: String,
  password: String,
  id: Number
});

const app = express();
const Users = mongoose.model('Users', dbSchema);
mongoose.connect('mongodb://localhost/blog-lesson');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.get('/api/users', async (req, res) => {
    const myRes = await Users.find();
    console.log(myRes);
    res.send(myRes);
  })
  app.get('/api/users/:id', async (req, res) => {
    // console.log('req', req);
    const id = req.params.id;
    try {
      let myRes1 = await Users.find({ id });
      if (myRes1.length === 0) {
        res.send('not found');
      } else {
        res.send(myRes1[0]);
      }
    } catch (e) {
      console.log('error', e);
    }
  }) 
})

app.listen(config.port, err => {
  if (err) throw err;
  console.log(`Server listening on port ${config.port}`);
});

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret
}));

app.get('/', async(req, res) => {
  res.end('Hello world!');
})
