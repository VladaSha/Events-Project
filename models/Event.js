const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
  name: String,
  event_id: String,
})

const Event = mongoose.model("events", eventSchema);

module.exports = Event;