const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : ' ';

    if(!Validator.isLength(data.text, { min: 2, max: 300})) {
        errors.text = "Posts must be between 2 & 300 characters"
    }

    if (Validator.isEmpty(data.text)) {
      errors.text = "text field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
