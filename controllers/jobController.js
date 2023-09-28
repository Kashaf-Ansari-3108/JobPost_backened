const jobModel = require("../models/jobSchema");

exports.createJob = async (req,res) => {
  try {
    const { title, organization, location, type, experience, salary, description,userID } = await req.body;
    const image = `http://localhost:5000/${req.body.image['name']}`;
    // If fields are missing
    if (!title || !organization || !location || !type || !experience || !salary || !image ||!description || !userID) {
      res.status(400).json({ message: "Required fields are missing" });
      return;
    }
    // if job already exist
    const existing = await jobModel.findOne({ title, organization, location, type, experience, salary, image, description });
    if (existing) {
        res.status(400).json({
          message: "Job already exist !!..",
        });
        return;
      }
    
    // create job
    const job = new jobModel({
      title, organization, location, type, experience, salary, description,image, userID
    });
      await job.save();
      res.status(200).json({
        message: "job created succesfully !!..",
        data: job,
        status: true,
      });  
    
  } catch (err) {
    console.log(err);
  }
};

exports.getAll = async (req,res) => {
  try {
    const jobs = await jobModel.find();
    res.status(200).json({
      message: "Jobs retrieved succesfully !!..",
      data: jobs,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong !!..",
    });
  }
};

exports.getByUserID = async (req,res) => {
  try {
    const {id} = req.params;
    const jobs = await jobModel.find({userID:id});
    res.status(200).json({
      message: "Jobs retrieved succesfully !!..",
      data: jobs,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong !!..",
    });
  }
};

exports.deleteJob = async (req,res) => {
  try {
    const {id} = req.params;
    const job = await jobModel.findByIdAndDelete(id);
    res.status(200).json({
      message: "Job deleted succesfully !!..",
      data: job,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong !!..",
    });
  }
}

exports.updateJob = async (req,res) => {
  try {
    const {id} = req.params;
    const job = await jobModel.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json({
      message: "Job updated succesfully !!..",
      data: job,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong !!..",
    });
  }
}

