const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/auth");
const path = require("path");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoDB";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("CONNECTION SUCCESSFUL");
    app.listen(PORT, () => {
      console.log(`SERVER RUNNING ON http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB conncection failed", err.message);
  });
