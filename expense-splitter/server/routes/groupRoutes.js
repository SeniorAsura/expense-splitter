const express = require("express");
const protect = require("../middleware/authMiddleware");


const {
  createGroup,
  getGroups,
  getGroupById,
  addMember,
  addExpense,
} = require("../controllers/groupController");

const router = express.Router();

// Create Group
router.post("/", protect, createGroup);

// Get All Groups
router.get("/", protect, getGroups);

// Get One Group
router.get("/:id", protect, getGroupById);

// Add Member
router.post("/:id/add-member", protect, addMember);

router.post("/:id/expense", protect, addExpense);

module.exports = router;