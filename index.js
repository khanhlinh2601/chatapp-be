const express = require("express");
const passport = require("passport");
const session = require("express-session");
const auth = require("./auth");
const db = require("./config/db");
const app = express();
const path = require("path");
const cors = require("cors");
const User = require("./app/models/User");
const Message = require("./app/models/Message");
const route = require("./routes");

const server = require("http").createServer(app);

const PORT = 3000;
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
db.connect();

//set up session
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

//test
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });
async function getLastMessagesFromRoom(room) {
  const filter = {
    to: room,
  };
  const sort = {
    createdAt: 1,
  };
  return await Message.find(filter).sort(sort);
}

io.on("connection", (socket) => {
  console.log("a user connected");


  socket.on("join-room", (newRoom, previousRoom) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = getLastMessagesFromRoom(newRoom);
    roomMessages.then((data) => {
      io.emit("room-messages", data);
    });
  });

  socket.on("message-room", async (msg, sender, receiver) => {
    const newMessage = await Message.create({
      from: sender,
      to: receiver,
      content: msg,
    });
    
    let roomMessages = getLastMessagesFromRoom(receiver);
    roomMessages.then((data) => {
      // io.to(data[0].receiver).emit("room-messages", roomMessages);
      io.emit("roomUsers", data);
      socket.broadcast.emit("notifications", data[0].receiver);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  app.delete("/logout", async (req, res) => {
    try {
      const { googleId } = req.body;
      console.log(googleId);
      const user = await User.findOne({ googleId: googleId });
      user.status = "offline";
      await user.save();
      req.session.destroy()
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});

route(app)
//login
// app.get("/login", (req, res) => {
//   res.send('<a href="/auth/google">Auth with Google</a>');
// });
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   function (req, res) {
//     res.redirect("/user");
//   }
// );

// function isLoggedIn(req, res, next) {
//   req.user ? next() : res.sendStatus(401);
// }
// //login in user
// app.get("/user", isLoggedIn, (req, res) => {
//   return res.json(req.user);
// });

server.listen(PORT, () => {
  console.log("Listening to port", PORT);
});
