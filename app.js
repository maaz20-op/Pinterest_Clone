require("dotenv").config();
const mongoose = require("mongoose");
  console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const express = require('express');
const app = express();
const path = require('path');
const moment = require("moment");

const cookieParser = require('cookie-parser');
const session = require("express-session");

const flash = require('connect-flash');
const MongoStore = require('connect-mongo'); 
const { Server } = require("socket.io");
const http   = require("http");
const server = http.createServer(app);
const userModel = require('./models/user-model');
const helmet = require('helmet');
const io  = new  Server(server);

const passport = require("passport");
require('./auth/google')
const createToken = require('./utils/generateToken');
//  require message connections of sockets 
const messageSocketsConnection = require("./socket/message-sockets-connection");


messageSocketsConnection(io);


// 📁 Public folder
app.use(express.static(path.join(__dirname, 'public')));

// passport setup 
app.use(passport.initialize());

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

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
  defaultSrc: ["'self'"],
  
  imgSrc: [
    "'self'", 
    "https://res.cloudinary.com",
     "https://freeimage.host",
     "https://iili.io"
    ],
  
  styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdnjs.cloudflare.com",
        "https://fonts.googleapis.com"
      ],
  
  connectSrc: ["'self'","https://api.cloudinary.com", "ws:" , "http:"],
  
  mediaSrc: [
    "'self'",
  "https://res.cloudinary.com"
  ],
  
  scriptSrc: [
  "'self'",
  "https://cdnjs.cloudflare.com",
  "https://widget.cloudinary.com",
],
  fontSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "https://fonts.gstatic.com",
        "'unsafe-inline'"
      ],
  },
  reportViolations: true,
  reportUri: "/csp-violation"
  
})
)





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
app.set('views', path.join(__dirname, 'views')); // make sure views folder ka path theek hai
// 📁 Routes



// mounting of routes 
const auth = require('./auth/google');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const postRouter = require("./routes/postRouter");
const pinRouter = require("./routes/pinRouter");
const commentRouter = require("./routes/commentRouter")

app.use('/', indexRouter);
app.use('/auth', auth);
app.use('/users', usersRouter);
app.use('/posts', postRouter);
app.use('/pins', pinRouter);
app.use('/comments',commentRouter)

app.locals.moment = moment;

app.use((err, req, res, next) => {
  
  
})

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log(`🚀 Server is running on port ${PORT}...`);
});

module.exports = server;