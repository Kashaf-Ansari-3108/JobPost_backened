const jwt = require("jsonwebtoken");

const jwtAuthorization = {
  sign(payload) {
    const token = jwt.sign(payload, process.env.secret_key);
    return token;
  },

  verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No Token Provided" });
    }
    try {
      const isValid = jwt.verify(token, process.env.secret_key);
      console.log(isValid);
      req.userId = isValid.userId; //Add the decoded payload to the request object
      if (isValid) {
        next();
      } else {
        res.json({ message: "Invalid user" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Something went wrong !!..",
      });
    }
  },
};
module.exports = jwtAuthorization;
