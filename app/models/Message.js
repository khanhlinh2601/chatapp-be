const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Message = new Schema(
  {
    content: String,
    from: String,
    to: String,
  },
  {
    collection: "message",
    timestamps: true,
  }
);
module.exports = mongoose.model("Message", Message);
