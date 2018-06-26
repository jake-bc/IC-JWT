const express = require("express");
const router = express.Router();
const http = require("https");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const request = require("request");
const passport = require("passport");
const uuidv4 = require("uuid/v4");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User Model
const User = require("../../models/User");

// @route       GET /api/users/tests
// @desc        Tests post route
// @access      Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));
// @route       POST /api/users/register
// @desc        Register user
// @access      Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email " + req.body.email + " already Exists";
      return res.status(400).json(errors);
    } else {
      const getCustomers = {
        method: "POST",
        url: keys.bcCustAPI,
        headers: {
          "X-Auth-Client": keys.bcclientId,
          "X-Auth-Token": keys.bcToken,
          "Cache-Control": "no-cache",
          "Content-Type": "application/json, text/plain, */*",
          Accept: "application/json, text/plain, */*"
        },
        body: {
          email: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          notes: req.body.avatar,
          _authentication: {
            password: req.body.password
          }
        },
        json: true
      };
      //create BigCommerce User
      request(getCustomers, function(error, response, bcbody) {
        console.log(bcbody);
        const bcid = bcbody.id;
        const bcemail = bcbody.email;

        /// create new mongodb user
        const newUser = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: req.body.password,
          bigcommerce_id: bcid,
          bigcommerce_email: bcemail,
          avatar: req.body.avatar
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      });
    }
  });
});

// @route       POST /api/users/login
// @desc        Login User / Return JWT Token
// @access      Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  //find user by email
  User.findOne({ email }).then(user => {
    //check for user
    if (!user) {
      errors.email = "User Not Found";
      return res.status(404).json(errors);
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = {
          iss: keys.bcclientId,
          operation: "customer_login",
          store_hash: keys.bchash,
          jti: uuidv4(),
          id: user.id,
          customer_id: user.bigcommerce_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
                };

        //sign token
        jwt.sign(
          payload,
          keys.secretOrkey,
          { expiresIn: 86400 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              payload: payload
            });
          }
        );
        console.log("https://www.jakesmith.us/login/token/" + token);
        res.json({ msg: "Success", token: "Bearer " + token });
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// validate password
router.post("/login/validate", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User Not Found";
      return res.status(404).json(errors);
    }

    if (user) {
      const pwval = {
        method: "POST",
        url: keys.bcCustAPI + "/" + user.bigcommerce_id + "/validate",
        headers: {
          "X-Auth-Client": keys.bcclientId,
          "X-Auth-Token": keys.bcToken,
          "Cache-Control": "no-cache",
          "Content-Type": "application/json, text/plain, */*",
          Accept: "application/json, text/plain, */*"
        },
        body: {
          password: req.body.password
        },
        json: true
      };

      request(pwval, function(error, response, pwsuccess) {
        if (error) throw new Error(error);
        if (pwsuccess.success === true) {
          console.log(true);
          return res.json({
            Msg: "Logged In Successfully",
            email: user.email,
            first_name: user.first_name,
            SecurePassword: user.password
          });
        }
        if (pwsuccess.success === false) {
          console.log(false);
          return res.json({
            Msg: "BigCommerce Login Validation Failed."
          });
        }
      });
    }
  });
});

// @route       GET /api/users/current
// @desc        Return Current User
// @access      Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.email });
    res.json(req.user);
  }
);

module.exports = router;
