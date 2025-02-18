const mongoose = require("mongoose");

const registrationKitSchema = new mongoose.Schema({
    user_id: {
        type: String,
        unique: true,  // Ensures that each user_id is unique
        required: true
    },
    kitReceived: {
        type: Boolean,
        required: true,  // Ensures the field is not omitted
        default: false   // Default value is false (kit not received)
    }
});

// The model name should be singular, and MongoDB will automatically convert it to the plural form ('registrationkitschemas')
module.exports = mongoose.model('RegistrationKit', registrationKitSchema);
