// const User = require('../models/userModel');
// const passport = require("passport");

// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// passport.use(
//     new GoogleStrategy(
//       {
//         clientID: GOOGLE_CLIENT_ID,
//         clientSecret: GOOGLE_CLIENT_SECRET,
//         callbackURL: GOOGLE_CALLBACK_URL,
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           // Check if the user exists in the database
//           let user = await User.findOne({ email: profile.emails[0].value });
//           if (user) {
//             // If the user exists, return the user object
//             return done(null, user);
//           } else {
//             // If the user doesn't exist, create a new user and return the user object
//             user = await User.create({
//               name: profile.displayName,
//               email: profile.emails[0].value,
//             });
//             return done(null, user);
//           }
//         } catch (error) {
//           return done(error);
//         }
//       }
//     )
//   );
  