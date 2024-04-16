// Importing necessary modules for the server's functionality
const cron = require("node-cron");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Load and apply environment variables from the .env file
require("dotenv").config();

// Initialize the express app
const app = express();

// Define the port for the express server using the environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Define MongoDB URI, Fortnite API key, and email password from the environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const FORTNITE_API_KEY = process.env.FORTNITE_API_KEY;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Configure nodemailer to use Gmail for email sending
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mrgeorgeflood@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

// Connect to the MongoDB database
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connection successful"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define a schema for Fortnite information and create a model
const fortniteInfoSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    skin: { type: String, required: true },
  },
  { timestamps: true }
);
const FortniteInfo = mongoose.model("FortniteInfo", fortniteInfoSchema);

// Apply middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Define a GET route for the server root that sends a hello message
app.get("/", (req, res) => {
  res.send("Hello from the Node.js server!");
});

// Define a POST route to handle Fortnite info submissions
app.post("/submit-fortnite-info", (req, res) => {
  const newFortniteInfoEntry = new FortniteInfo(req.body);
  newFortniteInfoEntry
    .save()
    .then(() => res.status(200).json("Fortnite info added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Start the server and listen on the specified PORT
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Schedule a cron job to check the Fortnite shop daily at 7:00 AM
cron.schedule("0 7 * * *", async () => {
  console.log("Cron job started");
  const shopUrl = "https://fortniteapi.io/v2/shop?lang=en";

  // Try block to handle API request and process the response
  try {
    const shopResponse = await fetch(shopUrl, {
      headers: { Authorization: FORTNITE_API_KEY },
    });

    // Throw an error if the response from the API is not OK
    if (!shopResponse.ok) {
      throw new Error(`HTTP error! Status: ${shopResponse.status}`);
    }

    // Parse the JSON response from the API
    const shopData = await shopResponse.json();
    console.log("Shop data retrieved");

    // Validate the shop data structure
    if (!shopData.result || !shopData.fullShop) {
      console.error(
        "Unexpected shopData format or error in response:",
        JSON.stringify(shopData, null, 2)
      );
      return;
    }

    // Process the shop items data
    const shopItems = shopData.shop;
    const relevantItems = shopItems.map((item) => ({
      name: item.displayName?.toLowerCase(),
    }));

    // Retrieve all users from the database to check their desired skins
    const users = await FortniteInfo.find({});
    console.log(`Number of users to check: ${users.length}`);

    // Loop through each user and check if their desired skin is available
    users.forEach(async (user) => {
      console.log(`Checking items for user: ${user.email}`);
      const skinAvailable = relevantItems.find(
        (item) => item.name === user.skin.toLowerCase()
      );

      // If the skin is available, send an email notification to the user
      if (skinAvailable) {
        console.log(`Item found for user: ${user.email}`);
        let mailOptions = {
          from: "mrgeorgeflood@gmail.com",
          to: user.email,
          subject: `Your Fortnite Item is now available!`,
          text: `Hello, your requested item "${formatSkinName(user.skin)}" is now available in the Fortnite shop!\n\nMany thanks for using Loot Look Out!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(`Error sending email: ${error}`);
          }
          console.log("Message sent: %s", info.messageId);
        });
      } else {
        console.log(`Item not found for user: ${user.email}`);
      }
    });
  } catch (error) {
    // Log any errors encountered during the cron job execution
    console.error("Error in Fortnite shop check cron job:", error);
  }
});
