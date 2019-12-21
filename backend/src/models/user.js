const mongoose = require("mongoose")

const Schema = mongoose.Schema

const User = new Schema({
  _id: { type: mongoose.Types.ObjectId, required: true },
  email: { type: String, required: true },
  hash: { type: String, required: true }
})

module.exports = mongoose.model("User", User)
