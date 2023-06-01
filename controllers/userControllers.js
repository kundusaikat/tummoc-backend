const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const passport = require("passport");
// const { authUserWithGoogle } = require('../config/passport');

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { fullName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  if (user) {
    const token = generateToken(user._id);
    user.tokens.push(token); // Save token to the user's tokens array
    await user.save();

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      city: null,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Unable to add user");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const isValid = await user.matchPassword(password);

  if (!isValid) {
    res.status(401);
    throw new Error("Password mismatch");
  }
  if (user && isValid) {
    const token = generateToken(user._id);
    user.tokens.push(token); // Save token to the user's tokens array
    await user.save();

    res.json({
      token: token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Authenticate user with Google
//@route           GET /api/users/auth/google
//@access          Public
// const authUserWithGoogle = passport.authenticate('google', {
//   scope: ['profile', 'email'],
// });

const getUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      city: user.city,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//@description     Logout the user
//@route           PUT /api/user/logout
//@access          Private

const logoutUser = asyncHandler(async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = req.userId; // Use req.userId instead of req.id

    // Update the user by pulling the token from the tokens array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { tokens: token } },
      { new: true }
    );

    console.log(user); // Updated user object with the token removed

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = { allUsers, registerUser, authUser, logoutUser, getUser };
