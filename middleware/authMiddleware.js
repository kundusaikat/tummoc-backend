const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const Blacklist = require("../models/blacklistModel.js");
const passport = require("../config/passport.js");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Check if token is blacklisted
      const blacklistedToken = await Blacklist.findOne({ token: token });

      if (blacklistedToken) {
        // Blacklisted token detected
        res.status(403).json({ message: "Access denied." });
        return;
      }

      // Not blacklisted, continue to route
      // Decode token and extract user ID
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const decoded = passport.authenticate("jwt", { session: false });
      // console.log(decoded);
      req._id = decoded.id;

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
