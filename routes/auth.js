const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();
const JWT_SECRET = " ";

router.post("/register", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      password: hashed,
    });
    res.status(201).json({
      message: "User created",
    });
  } catch (err) {
    res.status(400).send("ERROR", err.message);
  }
});

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token=jwt.s
  } catch (err) {
    res.json({ msg: err.message });
  }
});

module.exports = router;
