
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const flash = require('connect-flash');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));


// 📁 Database Connection
const db = require("./config/mongoose-connection");

// 📁 Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const postRouter = require("./routes/postRouter");
const pinRouter = require("./routes/pinRouter");
// 📢 Print current environment

// 🔐 Middlewares

app.use(cookieParser());

// Session must come before flash
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

// Make flash available to all EJS views globally
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

// 📂 Static folder


// 🌐 Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/posts",postRouter);
app.use("/pins",pinRouter);
// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}...`);
});