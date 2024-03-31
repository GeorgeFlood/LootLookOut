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
    pass: EMAIL_PASS,
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

let fetch;

cron.schedule("* * * * *", async () => {
  if (!fetch) {
    console.error("Fetch is not initialized. Trying to import.");
    import("node-fetch")
      .then(({ default: importedFetch }) => {
        fetch = importedFetch;
      })
      .catch((error) => {
        console.error("Failed to import fetch:", error);
        return;
      });
  }

  const shopUrl = "https://fortniteapi.io/v2/shop?lang=en";

  try {
    const shopResponse = await fetch(shopUrl, {
      headers: { Authorization: FORTNITE_API_KEY },
    });
    const shopData = await shopResponse.json();

    const shopItems = shopData.items || [];

    const users = await FortniteInfo.find({});

    for (let user of users) {
      const isItemAvailable = shopItems.some(
        (item) => item.displayName === user.skin
      );

      if (isItemAvailable) {
        console.log(`Notify ${user.email} about ${user.skin}`);
        let mailOptions = {
          from: "mrgeorgeflood@gmail.com",
          to: user.email,
          subject: "Item Available in Fortnite Shop!",
          text: `Hello, the item ${user.skin} is now available in the Fortnite shop!`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
    }
  } catch (error) {
    console.error("Error checking Fortnite shop:", error);
  }
});
