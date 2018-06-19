const express = require("express");
const router = express.Router();
const http = require("https");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const request = require("request");
const getBcUsers = require("./getbcusers");
const keys = require("../../config/keys");
const jwt = require("jsonwebtoken");
const postcart = require("../bcapi/postcart");


router.get('/', getBcUsers, (req, res) => {
        res.status(200).json(JSON.parse(data));
    });

router.get('/cart', postcart, (req, res) => {
    res.status(200).json(JSON.parse(data));
});

module.exports = router;