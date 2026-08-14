const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createExpense,
  getExpenses,
  deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

// Create a new expense
router.post("/", protect, createExpense);

// Get all expenses for a group
router.get("/:groupId", protect, getExpenses);

// Delete an expense
router.delete("/:id", protect, deleteExpense);

module.exports = router;