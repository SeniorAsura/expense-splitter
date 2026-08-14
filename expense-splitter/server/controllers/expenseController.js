const Expense = require("../models/Expense");
const Group = require("../models/Group");

// Create Expense
const createExpense = async (req, res) => {
  try {
    const { groupId, title, description, amount } = req.body;

    if (!groupId || !title || !amount) {
      return res.status(400).json({
        message: "Group, title and amount are required.",
      });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    // Only owner can add expenses
    if (group.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the group owner can add expenses.",
      });
    }

    const expense = await Expense.create({
      group: groupId,
      title,
      description,
      amount,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Expense created successfully.",
      expense,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// Get all expenses for a group
const getExpenses = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    // User must belong to the group
    const isMember = group.members.some(
      (member) => member.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    const expenses = await Expense.find({
      group: req.params.groupId,
    })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found.",
      });
    }

    const group = await Group.findById(expense.group);

    if (group.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the group owner can delete expenses.",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      message: "Expense deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  deleteExpense,
};