const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const session = require('express-session');
const passport = require("./config/passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const cors = require("cors");
const cityRoutes = require("./routes/cityRoutes.js");
const { default: axios } = require("axios");
const User = require("./models/userModel");

dotenv.config();

connectDB();
const app = express();

app.use(cors());

app.use(express.json()); // to accept json data

app.use(
  session({
    secret: "Saikat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


passport.use(new GoogleStrategy({
  clientID: "469626883868-11kt6jqqgpkpnjhb7smkka48tfct6ss6.apps.googleusercontent.com",
  clientSecret:"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",
  callbackURL: "http://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Handle the user data returned by Google OAuth
  // You can save the user data in your database or perform any other necessary actions
  console.log(profile);
  done(null, profile);
}));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
// Error Handling middlewares

// Google OAuth route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const code = req.query.code;

      // Make a request to Google's token endpoint to exchange the authorization code for an access token
      // const response = await axios.post(
      //   "https://oauth2.googleapis.com/token",
      //   {
      //     code: code,
      //     client_id: "YOUR_CLIENT_ID",
      //     client_secret: "YOUR_CLIENT_SECRET",
      //     redirect_uri: "http://localhost:3000/auth/google/callback",
      //     grant_type: "authorization_code",
      //   }
      // );

      // const { access_token } = response.data;

      // // Use the access token to fetch the user's profile from Google
      // const profileResponse = await axios.get(
      //   "https://www.googleapis.com/oauth2/v2/userinfo",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${access_token}`,
      //     },
      //   }
      // );

      // const { name, email } = profileResponse.data;

      // // Check if the user already exists in the database
      // let user = await User.findOne({ email });

      // if (!user) {
      //   // Create a new user in the database
      //   user = new User({ fullName: name, email });
      // }

      // // Save the user in the database
      // await user.save();

      // Successful authentication, redirect to the City page
      res.redirect("/city");
    } catch (error) {
      console.error(error);
      // Handle the error if needed
      // Redirect to an error page or display an error message
      res.redirect("/login");
    }
  }
);



app.use("/api/user", userRoutes);
app.use("/city",cityRoutes)

app.get("/", (req, res) => {
  res.send("API is running..");
});

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT;

app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);
