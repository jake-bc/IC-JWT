const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    unique: true,
    max: 40
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String
  },
  bigcommerce_custom_fields: {
    type: [String]
  },
  tax_exempt: {
    type: String
  },
  bigcommerce_customer_group_id: {
    type: String
  },
  bigcommerce_customer_group_name: {
    type: String
  },
  bigcommerce_store_credit: {
    type: String
  },
  bigcommerce_notes: {
    type: String
  },
  bio: {
    type: String
  },
  gender: {
    type: String
  },
  age: {
    type: String
  },
  githubusername: {
    type: String
  },
  social: {
    youtube: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    google: {
      type: String
    },
    amazon: {
      type: String
    },
    linkedin: {
      type: String
    }
  },
  shipping: [
    {
      first_name: {
        type: String
      },
      last_name: {
        type: String
      },
      company: {
        type: String
      },
      phonenumber: {
        type: String
      },
      address_line1: {
        type: String
      },
      address_line2: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      country: {
        type: String
      },
      zip: {
        type: String
      },
      current: {
        type: Boolean,
        default: false
      }
    }
  ],
  billing: [
    {
      first_name: {
        type: String
      },
      last_name: {
        type: String
      },
      phone_number: {
        type: String
      },
      address_line1: {
        type: String
      },
      address_line2: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      country: {
        type: String
      },
      zip: {
        type: String
      },
      current: {
        type: Boolean,
        default: false
      }
    }
  ],
  date_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
