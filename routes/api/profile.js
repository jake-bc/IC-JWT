const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("../../config/keys");
const bodyParser = require("body-parser");
//Load Validation
const validateProfileInput = require("../../validation/profile");

// load profile model
const Profile = require("../../models/Profile");

// load profile model
const User = require("../../models/User");

// @route       GET /api/profile/tests
// @desc        Tests post route
// @access      Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route       GET /api/profile
// @desc        Get current users profile
// @access      Public
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        return res.status(200).json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route       GET /api/profile/all
// @desc        Get all profiles
// @access      Public
router.get("/all", (req, res) => {
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

// @route       GET /api/profile/handle/:handle
// @desc        Get profile by handle
// @access      Private
router.get("/handle/:handle", (req, res) => {
  Profile.findOne({ handle: req.params.handle })
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
    .then(profile => {
      if (profile) {
        res.json(profile);
      }
      if (!profile) {
        errors.noprofile = "there is no profile for this user";
        res.status(400).json(errors);
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route       GET /api/profile/user/:user_id
// @desc        Get profile by user id
// @access      Private
router.get("/user/:user_id", (req, res) => {
  Profile.findOne({ user: req.params.user_id })
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
    .then(profile => {
      if (profile) {
        res.json(profile);
      }
      if (!profile) {
        errors.noprofile = "there is no profile for this user";
        res.status(400).json(errors);
      }
    })
    .catch(err => res.status(404).json(err));
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;

    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;

    //BigCommerce Custom Fields - Split into array

    //bigcommerce
    if (req.body.bigcommerce_custom_fields)
      profileFields.bigcommerce_custom_fields = req.bigcommerce_custom_fields;

    if (req.tax_exempt) profileFields.tax_exempt = req.tax_exempt;
    if (req.body.bigcommerce_customer_group_id)
      profileFields.bigcommerce_customer_group_id =
        req.body.bigcommerce_customer_group_id;
    if (req.body.bigcommerce_customer_group_name)
      profileFields.bigcommerce_customer_group_name =
        req.body.bigcommerce_customer_group_name;
    if (req.body.bigcommerce_store_credit)
      profileFields.bigcommerce_store_credit =
        req.body.bigcommerce_store_credit;
    if (req.body.bigcommerce_notes)
      profileFields.bigcommerce_notes = req.body.bigcommerce_notes;

    //other profile objects
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.age) profileFields.age = req.body.age;
    if (req.body.gender) profileFields.gender = req.body.gender;
    if (req.body.tax_exempt) profileFields.tax_exempt = req.body.tax_exempt;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    if (req.body.notes) profileFields.notes = req.body.notes;
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.google) profileFields.social.google = req.body.google;
    if (req.body.amazon) profileFields.social.amazon = req.body.amazon;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    // Shipping Address
    profileFields.shipping_address = {};
    if (req.body.first_name) profileFields.first_name = req.body.first_name;
    if (req.body.last_name) profileFields.last_name = req.body.last_name;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.phonenumber) profileFields.phonenumber = req.body.phonenumber;
    if (req.body.address_line1)
      profileFields.address_line1 = req.body.address_line1;
    if (req.body.address_line2)
      profileFields.address_line2 = req.body.address_line2;
    if (req.body.city) profileFields.city = req.body.city;
    if (req.body.state) profileFields.state = req.body.state;
    if (req.body.country) profileFields.country = req.body.country;

    // @route       POST /api/profile
    // @desc        Create or Edit user profile
    // @access      Private

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //create
        //check if handle exits

        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if (profile) {
              errors.handle = "that handle already exists";
              res.status(404).json(errors);
            }

            // save profile
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          })
          .catch(err => res.status(404).json(err));
      }
    });
  }
);

// @route       Post / Shipping Address
// @desc        Create Profile Shipping
// @access      Public
router.post(
  "/shipping",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newShipping = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        company: req.body.company,
        phonenumber: req.body.phonenumber,
        address_line1: req.body.address_line1,
        address_line2: req.body.address_line2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country
      }
      profile.shipping.unshift(newShipping)
      profile.save().then(profile => res.json(profile));

    });
  }
);

module.exports = router;
