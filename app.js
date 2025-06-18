require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const flash = require('connect-flash');
const MongoStore = require('connect-mongo'); // ✅ add this

const app = express();

// 📁 Public folder
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 Middlewares
app.use(cookieParser());

// ✅ Session Store using MongoDB (no MemoryStore warning now)
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use(flash());

// 📢 Flash messages for EJS views
app.use(function(req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// 🧠 Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 🖼️ View engine
app.set('view engine', 'ejs');

// 📁 Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const postRouter = require("./routes/postRouter");
const pinRouter = require("./routes/pinRouter");

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);
app.use('/pins', pinRouter);

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`🚀 Server is running on port ${PORT}...`);
});