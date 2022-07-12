const express = require("express");
const passport = require("passport");
const session = require("express-session");
const auth = require("./auth");
const db = require('./config/db')
const app = express();
const path = require('path');
const cors = require('cors')
const User = require('./models/User');
const Message = require('./models/Message')

const server = require('http').createServer(app);

const PORT = 5000;
// const io = require('socket.io')(server, {
//   cors: {
//     origin: 'http://localhost:5000',
//     methods: ['GET', 'POST']
//   }
// })
const io = require('socket.io')(server)

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors());
db.connect()

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next()
})
//set up session
app.use(session({ secret: "cats"}));
app.use(passport.initialize());
app.use(passport.session());

//socket
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
io.on('connection', (socket)=>{
  socket.on('new-user', ()=>{
    const members = User.find()
    io.emmit('new-user', members)
  })
})
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    let chatMessage = new Message({
      content: msg,
    })
    chatMessage.save();
  });
});

//login
app.get("/login", (req, res) => {
  res.send('<a href="/auth/google">Auth with Google</a>');
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/user");
  }
);

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
//login in user
app.get("/user", isLoggedIn, (req, res) => {
  res.json(req.user)
});
app.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.json('Logout');
  return req.logOut();
});


server.listen(PORT, () => {
  console.log('Listening to port', PORT)
});
