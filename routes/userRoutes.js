const express = require("express");
const passport = require("../config/passport");
const {
  registerUser,
  authUser,
  allUsers,
  logoutUser,
  getUser,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Initialize passport middleware
// require("../config/passport");

// /api/user
router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.get("/info", protect, getUser);


router.get("/logout", protect, logoutUser);

module.exports = router;
