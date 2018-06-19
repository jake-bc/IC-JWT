const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("../../config/keys");
const bodyParser = require("body-parser");
const request = require("request");

// load User model
const Profile = require("../../models/Profile");

// load User model
const User = require("../../models/User");

// @route       GET /api/User/all
// @desc        Get all Users
// @access      Public
router.get("/", (req, res) => {
  User.find()
    .populate("user", [
      "id",
      "bigcommerce_id",
      "bigcommerce_email",
      "email",
      "first_name",
      "last_name",
      "bigcommerce_custom_fields",
      "date_created"
    ])
    .then(Users => {
      if (Users) {
        res.json(Users);
      }
      if (!Users) {
        errors.noUsers = "there are no Users";
        res.status(400).json(errors);
      }
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;