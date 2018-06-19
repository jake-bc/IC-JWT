const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("../../config/keys");
const bodyParser = require("body-parser");
const request = require("request");
//Load Validation
// load profile model
const Profile = require("../../models/Profile");

// load profile model
const User = require("../../models/User");

// @route       GET /api/profile/all
// @desc        Get all profiles
// @access      Private
router.get("/", (req, res) => {
    Profile.find()
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
        .then(profiles => {
            if (profiles) {
                res.json(profiles);
            }
            if (!profiles) {
                errors.noprofiles = "there are no profiles";
                res.status(400).json(errors);
            }
        })
        .catch(err => res.status(404).json(err));
});



module.exports = router;