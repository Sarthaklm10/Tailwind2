const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(401).json({
      message: "FAILED TO GET",
    });
  }
});

router.post("/", authMiddleware, async function (req, res) {
  try {
    const task = new Task({ title: req.body.title, user: req.userId });
    const savedTask = await task.save();
    res.status(201).json({
      message: "Task added successfully",
      task: savedTask,
    });
  } catch (err) {
    console.error(err);
    res.send(400).json({
      message: err.message,
    });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Not found" });

    if (task.user.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    if (typeof req.body.completed === "boolean")
      task.completed = req.body.completed;
    if (typeof req.body.title === "string") task.title = req.body.title;

    await task.save();
    res.json({ message: "Updated", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Update failed" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (req.userId !== task.user.toString())
      return res.status(403).json({ message: "Unauthorized" });

    console.log("Task deleted is", task.title);
    await Task.findByIdAndDelete(id);

    res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
