const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Cost = new Schema({
  _id: { type: mongoose.Types.ObjectId, required: true },
  userId: { type: String, required: true },
  purpose: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model("Cost", Cost);
