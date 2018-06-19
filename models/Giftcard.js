const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const GiftcardSchema = new Schema({
    bc_id: {
        type: String
    },
    code: {
        type: String,
        required: true
    },
    bcrypt_code: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
    balance: {
        type: String
    },
    message: {
        type: String
    },
    to_name: {
        type: String
    },
    order_id: {
        type: Date,
        default: Date.now
    },
    template: {
        type: String
    },
    to_email: {
        type: String
    },
    from_name: {
        type: String
    },
    from_email: {
        type: String
    },
    customer_id: {
        type: String
    },
    expiry_date: {
        type: String
    },
    purchase_date: {
        type: String
    },
});

module.exports = Giftcard = mongoose.model('giftcards', GiftcardSchema);