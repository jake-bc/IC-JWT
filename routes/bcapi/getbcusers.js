const express = require("express");
const router = express.Router();
const http = require("https");
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("../../config/keys");
const bodyParser = require("body-parser");
const request = require("request");


router.get("/", (req, res) => {
  const errors = {};
      const getbc = {
        url: keys.bcCustAPI,
        headers: {
          "X-Auth-Client": keys.bcclientId,
          "X-Auth-Token": keys.bcToken,
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        data: {
          
        }
      };
      //create BigCommerce User
      request(getbc, function(error, response, data) {
        console.log(errors);
        res.json(JSON.parse(data));
      });
    });

module.exports = router;
