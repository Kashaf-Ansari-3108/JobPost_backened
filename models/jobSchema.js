const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title:{type:String,required:true},
    organization:{type:String,required:true},
    location:{type:String,required:true},
    type:{type:String,required:true},
    experience:{type:String,required:true},
    salary:{type:String,required:true},
    description:{type:String,required:true},
    email:{type:String,required:true},
    userID:{type:String,required:true},
    created_on: {type: Date,default: Date.now}
});

const jobModel = mongoose.model('job',jobSchema);
module.exports = jobModel;
