const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    googleId: {
      type: String,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    status: {
      type: String,
      default: "online",
    },
  },
  {
    collection: "user",
  }
);

module.exports = mongoose.model("User", User);
