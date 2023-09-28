const express = require('express');
const router = express.Router();
const {createJob,getAll,getByUserID,deleteJob,updateJob} = require("../controllers/jobController")
const jwt = require('../middlewares/jwtMiddleware')
const multer  = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage })

router.post("/createjob",upload.single("image"),jwt.verifyToken,createJob);
router.get("/alljobs",getAll);
router.get("/yourjobs/:id",jwt.verifyToken,getByUserID);
router.delete("/deletejob/:id",jwt.verifyToken,deleteJob);
router.put("/updatejob/:id",jwt.verifyToken,updateJob);

module.exports = router;