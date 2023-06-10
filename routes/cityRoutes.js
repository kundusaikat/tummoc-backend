const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const express = require("express");

const cityRoutes = express.Router();

cityRoutes.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    User.find()
      .populate("city")
      .exec((error, users) => {
        if (error) {
          console.error("Error querying users:", error);
        } else {
          console.log(users);
        }
      });

    // Aggregation pipeline to combine user and city data
    User.aggregate([
      {
        $lookup: {
          from: "cities", // The name of the city collection
          localField: "city",
          foreignField: "name",
          as: "cityData",
        },
      },
      {
        $project: {
          name: 1,
          city: { $arrayElemAt: ["$cityData.name", 0] }, // Extract the city name from the array
        },
      },
    ]).exec((error, result) => {
      if (error) {
        console.error("Error aggregating data:", error);
      } else {
        console.log("Combined data:", result);
      }
    });
  })
);

module.exports = cityRoutes;
