const express = require("express");
const router = express.Router();
const http = require("https");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const request = require("request");

// Load input validation
const validateLoginInput = require("../../validation/login");

// Load User Model
const User = require("../../models/User");


    
router.post("/", (req, res) => {
    const errors = {};
    const options = {
        url: keys.bcCartAPI,
        headers: {
            "X-Auth-Client": keys.bcclientId,
            "X-Auth-Token": keys.bcToken,
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            Accept: "application/json"
        },
  body:  { line_items: [ { quantity: 4, product_id: 14250, variant_id: 0, list_price: 1 } ] },
  json: true
};


    request(options, function(error, response, data) {
        console.log(errors);
        res.json(response);
    });
});

module.exports = router;