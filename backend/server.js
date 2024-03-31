// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// data base name
// Make sure to replace <password> with the actual password and myFortniteApp with your database name.

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true })
  .then(() => console.log("MongoDB connection successful"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define a Mongoose schema and model for Fortnite info
const fortniteInfoSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    skin: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const FortniteInfo = mongoose.model("FortniteInfo", fortniteInfoSchema);

app.use(cors());
app.use(express.json());

// GET route for the root path
app.get("/", (req, res) => {
  res.send("Hello from the Node.js server!");
});

// POST route to submit Fortnite info
app.post("/submit-fortnite-info", (req, res) => {
  const { email, skin } = req.body;

  const newFortniteInfoEntry = new FortniteInfo({ email, skin });

  newFortniteInfoEntry
    .save()
    .then(() => res.status(200).json("Fortnite info added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
