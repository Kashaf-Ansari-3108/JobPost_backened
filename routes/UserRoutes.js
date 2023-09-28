const express = require('express');
const router = express.Router();
const {sendOTP, signUp,login,getUser,updateUser} = require('../controllers/userControllers');
const jwt = require('../middlewares/jwtMiddleware')

router.post("/sendOTP",sendOTP);
router.post("/signup",signUp);
router.post("/login",login);
router.get("/getuser/:id",jwt.verifyToken,getUser);
router.put("/updateuser/:id",jwt.verifyToken,updateUser);

module.exports = router;