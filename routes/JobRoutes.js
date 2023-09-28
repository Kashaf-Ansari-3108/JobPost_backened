const express = require('express');
const router = express.Router();
const {createJob,getAll,getByUserID,deleteJob,updateJob} = require("../controllers/jobController")
const jwt = require('../middlewares/jwtMiddleware')

router.post("/createjob",jwt.verifyToken,createJob);
router.get("/alljobs",getAll);
router.get("/yourjobs/:id",jwt.verifyToken,getByUserID);
router.delete("/deletejob/:id",jwt.verifyToken,deleteJob);
router.put("/updatejob/:id",jwt.verifyToken,updateJob);

module.exports = router;