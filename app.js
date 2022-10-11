const express = require('express');
const path = require('path');
const User = require('./models/user');
const mongoose = require('mongoose');
const session = require('express-session');
const MongodbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const { storage } = require('./util/storage')
require('dotenv').config()


const PORT = process.env.PORT || 3001;
const app = express();
const MONGODB_URI =
  'mongodb+srv://horus:compaq7550@cluster0.apjnbmb.mongodb.net/shop';

const store = new MongodbStore({
  uri: process.env.MONGODB_CONNECTION_STRING,
  collection: 'sessions',
});
const csrfProtection = csrf();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  )
    cb(null, true);
  else cb(null, false);
};
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
//app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(multer({ storage }).single('image'));

app.use(
  session({
    secret: 'thisIsMySecret',
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

//handle 404 page
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log('\n🦖 server up to date on 3001: 🦖\n');
    });
  })
  .catch((err) => console.log(err));
