

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const complaintRoutes = require("./routes/complaintRoutes");

// Use routes
app.use("/api/complaints", complaintRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Jan Seva Connect API Running");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});