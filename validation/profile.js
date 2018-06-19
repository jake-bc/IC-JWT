const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "handle is Required";
  }
  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "handle must be atleast 2 characters";
  }
  // forcing as url's

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website))
      errors.website = "Website is not a valid URL";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website))
      errors.website = "Website is not a valid URL";
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube))
      errors.youtube = "youtube link is not a valid URL";
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook))
      errors.facebook = "facebook link is not a valid URL";
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram))
      errors.instagram = "instagram link is not a valid URL";
  }

  if (!isEmpty(data.google)) {
    if (!Validator.isURL(data.google))
      errors.google = "google link is not a valid URL";
  }

  if (!isEmpty(data.amazon)) {
    if (!Validator.isURL(data.amazon))
      errors.amazon = "amazon link is not a valid URL";
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin))
      errors.linkedin = "linkedin link is not a valid URL";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
