const express = require("express");
const passport = require("passport");
const {
  registerUser,
  authUser,
  allUsers,
  logoutUser,
  authUserWithGoogle
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Initialize passport middleware
require("../config/passport");

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.get("/auth/google", authUserWithGoogle);

// Google OAuth callback route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.post("/logout", protect, logoutUser);

module.exports = router;
r
