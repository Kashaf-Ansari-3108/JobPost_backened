const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt-inzi");
const jwt = require("../middlewares/jwtMiddleware");
const otpModel = require('../models/otpSchema'); 
const twilio = require('twilio');

// Twilio credentials
const accountSid = 'AC136eed8cb0010a4a92732c8256fdd075';
const authToken = 'd94ab1ca883929a10e52e73a6fa8eab0';
const twilioPhoneNumber = '+1 712 581 7225';

// Twilio client
const client = twilio(accountSid, authToken);

exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
     

     // if user already exist
     const existing = await userModel.findOne({ phone_number:phoneNumber });
     if (existing) {
       res.status(400).json({
         message: "User already exist !!..",
       });
       return;
     }

    function generateRandomOTP(length = 6) {
      const digits = '0123456789';
      let otp = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
      }
      return otp;
    }
    const otp = generateRandomOTP();

    
    const existingOTP = await otpModel.findOne({ phone_number:phoneNumber });

    // If the email already exists, update the existing record with the new OTP
    if (existingOTP) {
      existingOTP.otp = otp;
      existingOTP.created_on = new Date();
      await existingOTP.save();
    } else {
      // If the email doesn't exist, create a new OTP record
      const newOTP = new otpModel({
        phone_number:phoneNumber,
        otp,
      });
      await newOTP.save();
    }

    // Send the OTP via SMS using Twilio
    await client.messages.create({
      to: phoneNumber,
      from: twilioPhoneNumber,
      body: `Your OTP for registration in JobFinder is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong !!..",
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, otp } = req.body;
    
    // Check for missing fields
    if (!name || !email || !phoneNumber || !password || !otp) {
      res.status(400).json({ message: "Required fields are missing" });
      return;
    }

    // if user already exist
    const existing = await userModel.findOne({ email });
    if (existing) {
      res.status(400).json({
        message: "User already exist !!..",
      });
      return;
    }

    // Retrieve the OTP record from the database based on the phone number
    const otpRecord = await otpModel.findOne({ phoneNumber });

    function isValidOTPWithinTimeFrame(otpCreatedAt) {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); 
      return otpCreatedAt >= thirtyMinutesAgo;
    }
    
    // Check if the OTP record exists and is within the allowed time frame (30 minutes)
    if (!otpRecord || !isValidOTPWithinTimeFrame(otpRecord.created_on)) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    // Verify OTP
    if (otp !== otpRecord.otp) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }

    // Hash password
    const hashpwd = await bcrypt.stringToHash(password);

    // Create user
    const user = new userModel({
      name,
      email,
      phone_number:phoneNumber,
      password: hashpwd,
    });

    await user.save();

    // Remove the OTP record from the database since it has been used
    await otpModel.deleteOne({ phoneNumber });

    const token = await jwt.sign(req.body);
    res.status(200).json({
      message: "User created successfully!",
      data: user,
      token,
      status: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = await req.body;
    // find user
    const user = await userModel.findOne({ email });
    // Verify Password
    const verifyHash = await bcrypt.varifyHash(password, user.password);
    if (!verifyHash) {
      res.status(400).json({ message: "Crendentials error" });
      return;
    }
    if (verifyHash) {
      const tokenObj = {
        ...user,
      };
      const token = await jwt.sign(tokenObj);
      // User get
      res.status(200).json({
        message: "User login succesfully !!..",
        data: user,
        token,
        status: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong !!..",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const {id} = req.params;
    const user = await userModel.find({_id:id});
    res.status(200).json({
      message: "User retrieved succesfully !!..",
      data: user,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong !!..",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {id} = req.params;
    const {name,password} = req.body;
    // If fields are missing
    if (!name || !password) {
      res.status(400).json({ message: "Required fields are missing" });
      return;
    }
    // hash password
    const hashpwd = await bcrypt.stringToHash(password, 10);
    //update User
    const user = await userModel.findByIdAndUpdate(id,{name,password:hashpwd},{new:true});
    res.status(200).json({
      message: "User updated succesfully !!..",
      data: user,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong !!..",
    });
  }
};
