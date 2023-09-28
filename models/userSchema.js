const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone_number:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    created_on: {
        type: Date,
        default: Date.now,
      }
});

const userModel = mongoose.model('user',userSchema);
module.exports = userModel;
