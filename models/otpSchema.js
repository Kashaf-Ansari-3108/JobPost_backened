const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phone_number:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    created_on: {
        type: Date,
        default: Date.now,
      }
});

const otpModel = mongoose.model('otp',otpSchema);
module.exports = otpModel;
