const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcUserSchema = new Schema({
  id: {
    type: String
  },
  customer_group_id: {
    type: String
  },
  company: {
    type: String
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  notes: {
    type: String
  }
});

module.exports = bcUser = mongoose.model("bcUsers", UserSchema);