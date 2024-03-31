const cron = require("node-cron");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const FORTNITE_API_KEY = process.env.FORTNITE_API_KEY;
const EMAIL_PASS = process.env.EMAIL_PASS;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mrgeorgeflood@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connection successful"))
  .catch((error) => console.error("MongoDB connection error:", error));

const fortniteInfoSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    skin: { type: String, required: true },
  },
  { timestamps: true }
);

const FortniteInfo = mongoose.model("FortniteInfo", fortniteInfoSchema);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the Node.js server!");
});

app.post("/submit-fortnite-info", (req, res) => {
  const newFortniteInfoEntry = new FortniteInfo(req.body);
  newFortniteInfoEntry
    .save()
    .then(() => res.status(200).json("Fortnite info added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Fortnite Shop Check Scheduled Task
cron.schedule("0 7 * * *", async () => {
  console.log("Cron job started");
  const shopUrl = "https://fortniteapi.io/v2/shop?lang=en"; // Adjust language if needed

  try {
    const shopResponse = await fetch(shopUrl, {
      headers: { Authorization: FORTNITE_API_KEY },
    });

    if (!shopResponse.ok) {
      throw new Error(`HTTP error! Status: ${shopResponse.status}`);
    }

    const shopData = await shopResponse.json();
    console.log("Shop data retrieved");

    // Detailed logging for debugging (comment out later)
    console.log("API Response (full):", shopData);

    // Check for successful response
    if (!shopData.result || !shopData.fullShop) {
      // Updated checks based on API docs
      console.error(
        "Unexpected shopData format or error in response:",
        JSON.stringify(shopData, null, 2)
      );
      // Consider retry logic or handling errors here
      return;
    }

    // Access shop items from the updated structure
    const shopItems = shopData.shop;

    // Filtered relevant data (if needed)
    const relevantItems = shopItems.map((item) => ({
      name: item.displayName?.toLowerCase(), // Use displayName for item name
      // Include other properties if needed based on API data
    }));

    const users = await FortniteInfo.find({});
    console.log(`Number of users to check: ${users.length}`);

    users.forEach(async (user) => {
      console.log(`Checking items for user: ${user.email}`);

      // Find if any item matches the user's skin preference
      const skinAvailable = relevantItems.find(
        (item) => item.name === user.skin.toLowerCase()
      );

      if (skinAvailable) {
        console.log(`Item found for user: ${user.email}`);

        const formatSkinName = (skinName) => {
          return skinName
            .split(" ") // Split the string into an array of words
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ) // Capitalize the first character of each word
            .join(" "); // Join the words back into a single string
        };

        let mailOptions = {
          from: "mrgeorgeflood@gmail.com", // Replace with your actual email
          to: user.email,
          subject: `Your Fortnite Item is now available!`,
          text: `Hello, your requested item "${formatSkinName(user.skin)}" is now available in the Fortnite shop!\n\n Many thanks for using Loot Look Out!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(`Error sending email: ${error}`);
          }
          console.log("Message sent: %s", info.messageId);
        });
      } else {
        console.log(`Item not found for user: ${user.email}`);
      }
    });
  } catch (error) {
    console.error("Error in Fortnite shop check cron job:", error);
  }
});
