const express = require("express");
const router = express.Router();
const http = require("https");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const request = require("request");
const passport = require("passport");
const uuidv4 = require("uuid/v4");
// Load User Model
const Giftcard = require("../../models/Giftcard");
const validateGiftcardInput = require("../../validation/giftcards");

const validateBalanceInput = require("../../validation/gcbalance");

// @route       GET /api/shift4/tests
// @desc        Tests post route
// @access      Public
router.get("/test", (req, res) => res.json({ msg: "Giftcards Works" }));
// @route       POST /api/shift4/Giftcard
// @desc        Giftcard user
// @access      Public
router.post("/giftcards", (req, res) => {
    const { errors, isValid } = validateGiftcardInput(req.body);
    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Giftcard.findOne({ code: req.body.code }).then(giftcards => {
        if (giftcards) {
            errors.code = "Code " + req.body.code + " already Exists";
            return res.status(400).json(errors);
        } else {
            const getGiftcards = {
                method: "POST",
                url: keys.bcGCAPI,
                headers: {
                    "X-Auth-Client": keys.bcclientId,
                    "X-Auth-Token": keys.bcToken,
                    "Cache-Control": "no-cache",
                    "Content-Type": "application/json;charset=utf-8",
                    Accept: "application/json, text/plain, */*"
                },
                body: {
                    code: req.body.code,
                    amount: req.body.amount,
                    balance: req.body.balance,
                    to_name: req.body.to_name,
                    to_email: req.body.to_email,
                    from_name: req.body.from_name,
                    from_email: req.body.from_email
                },
                json: true
            };
            //create BigCommerce User
            request(getGiftcards, function (error, response, bcbody) {
                console.log(bcbody);
                const bcid = bcbody.id;
                const bccode = bcbody.code;

                /// create new mongodb Giftcard
                const newGiftcard = new Giftcard({
                    code: req.body.code,
                    amount: req.body.amount,
                    balance: req.body.balance,
                    to_name: req.body.to_name,
                    to_email: req.body.to_email,
                    from_name: req.body.from_name,
                    from_email: req.body.from_email,
                    bc_id: bcid,
                    bcrypt_code: bccode,
                    code: bccode
                    
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newGiftcard.bcrypt_code, salt, (err, hash) => {
                        if (err) throw err;
                        newGiftcard.bcrypt_code = hash;
                        newGiftcard
                            .save()
                            .then(giftcard => res.json(giftcard))
                            .catch(err => console.log(err));
                    });
                });
            });
        }
    });
});

// @route       POST /api/users/Balance
// @desc        Balance User / Return JWT Token
// @access      Public
router.post("/balance", (req, res) => {
    const { errors, isValid } = validateBalanceInput(req.body);
    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const balance = req.body.balance;
    const code = req.body.code;
    //find user by email
    Giftcard.findOne({ code }).then(giftcard => {
        //check for user
        if (!giftcard) {
            errors.code = "User Not Found";
            return res.status(404).json(errors);
        }

        //check code
        bcrypt.compare(code, giftcard.bcrypt_code).then(isMatch => {
            if (isMatch) {
                // User Matched
                const payload = {
                    iss: keys.bcclientId,
                    operation: "gift_card",
                    store_hash: keys.bchash,
                    jti: uuidv4(),
                    balance: giftcard.balance,
                    code: giftcard.code,
                    bcrypt_code: giftcard.bcrypt_code
                };

                //sign token
                jwt.sign(
                    payload,
                    keys.secretOrkey,
                    { expiresIn: 86400 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: token,
                            payload: payload
                        });
                    }
                );
            } else {
                errors.code = "Code Incorrect";
                return res.status(400).json(errors);
            }
        });
    });
});

router.get("/test/bigcommerce", (req, res) => res.json({ msg: "Giftcards Works" }));

router.get('/giftcards/:code', (req, res) => {
    Giftcard.findOne({ code: req.params.code })
        .then(giftcard => res.json({giftcard: giftcard}))
        .catch(err => res.status(404).json({ nopostfound: 'No Post Found With ID' })
        );
});


router.post('/giftcards/:code', (req, res) => {
    Giftcard.findOne({ code: req.params.code })
        .then(giftcard => res.json(giftcard), console.log("sucess"))
        .catch(err => res.status(404).json({ nopostfound: 'No Post Found With ID' })
        );
});

module.exports = router;
