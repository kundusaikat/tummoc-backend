
const passport = require("passport");

const passportJWT = require('passport-jwt');
const User = require("../models/userModel");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;



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


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "Saikat"
};


passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
