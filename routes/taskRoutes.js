const express = require("express");
const router = express.Router();
const Task = require("../models/task");

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(401).json({
      message: "FAILED TO GET",
    });
  }
});

router.post("/", async function (req, res) {
  try {
    const task = new Task(req.body);
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

router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Not found" });

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

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedElt = await Task.findById(id);
    console.log("Element deleted is", deletedElt.title);
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
