const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
  username: String,
  password: String,
  favoriteEvents: [{ type : ObjectId, ref: 'events' }]
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;