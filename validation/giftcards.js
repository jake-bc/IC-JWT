const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateGiftcardInput(data) {
    let errors = {};

    data.to_name = !isEmpty(data.to_name) ? data.to_name : "";
    data.from_name = !isEmpty(data.from_name) ? data.from_name : "";
    data.from_email = !isEmpty(data.from_email) ? data.from_email : "";
    data.to_email = !isEmpty(data.to_email) ? data.to_email : "";
    data.code = !isEmpty(data.code) ? data.code : "";
    data.balance = !isEmpty(data.balance) ? data.balance : "";
    data.amount = !isEmpty(data.amount) ? data.amount : "";

    if (Validator.isEmpty(data.to_name)) {
        errors.to_name = "first name is required";
    }

    if (Validator.isEmpty(data.to_email)) {
        errors.to_email = "Email is invalid";
    }
    if (Validator.isEmpty(data.from_email)) {
        errors.from_email = "Email is invalid";
    }

    if (Validator.isEmpty(data.from_name)) {
        errors.from_name = "Last field is required";
    }
    if (Validator.isEmpty(data.code)) {
        errors.code = "code field is required";
    }
    if (Validator.isEmpty(data.balance)) {
        errors.balance = "balance field is required";
    }
    if (Validator.isEmpty(data.amount)) {
        errors.amount = "amount field is required";
    }
    if (!Validator.isLength(data.code, { min: 6, max: 30 })) {
        errors.code = "code must be atleast 6 characters";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
