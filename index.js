const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const session = require('express-session');

const cors = require("cors");

dotenv.config();

connectDB();
const app = express();

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,GOOGLE_CALLBACK_URL} = process.env;

app.use(
  cors({
    origins: ["*"],
    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "POST, PUT, PATCH, GET, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorizationr",
        "Access-Control-Allow-Credentials": "true",
      });
      res.end();
    },
  })
);
app.use(express.json()); // to accept json data

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running..");
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);
