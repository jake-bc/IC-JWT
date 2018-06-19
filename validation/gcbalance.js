const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateBalanceInput(data) {
    let errors = {};

    data.balance = !isEmpty(data.balance) ? data.balance : "";
    data.code = !isEmpty(data.code) ? data.code : "";

    if (Validator.isEmpty(data.balance)) {
        errors.balance = "balance is required!";
    }
    if (Validator.isEmpty(data.code)) {
        errors.code = "code field is required";
    }

    if (!Validator.isLength(data.code, { min: 6, max: 30 })) {
        errors.code = "code must be atleast 6 characters";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
