const Group = require("../models/Group");
const User = require("../models/User");

// Create Group
const createGroup = async (req, res) => {
  try {
    const { name, description, currency } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Group name is required.",
      });
    }

    const group = await Group.create({
      name,
      description,
      currency: currency || "USD",
      owner: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// Get all groups
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.id,
    })
      .populate("owner", "name")
      .populate("members", "name");

    res.status(200).json(groups);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// Get one group
const getGroupById = async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.id,
      members: req.user.id,
    })
      .populate("owner", "name")
      .populate("members", "name");

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    res.status(200).json(group);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// Add member
const addMember = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    // Find group
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    // Permission check
    if (
      (group.settings?.onlyOwnerCanAddMembers ?? false) &&
      group.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Only the group owner can add members.",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "No account exists with this email.",
      });
    }

    // Already yourself?
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        message: "You are already in this group.",
      });
    }

    // Already a member?
    const alreadyMember = group.members.some(
      (member) => member.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User is already a member.",
      });
    }

    // Guest restriction
    if (
      user.guest &&
      !(group.settings?.allowGuestMembers ?? true)
    ) {
      return res.status(403).json({
        message: "Guest accounts are not allowed in this group.",
      });
    }

    // Add member
    group.members.push(user._id);

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("owner", "name")
      .populate("members", "name");

    res.status(200).json({
      message: "Member added successfully.",
      group: updatedGroup,
    });
  } catch (err) {
    console.error("ADD MEMBER ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// Add or update the group's total expense
const addExpense = async (req, res) => {
  try {
    const { title, amount } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        message: "Title and amount are required.",
      });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    // Only the owner can add/update the expense
    if (group.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the group owner can add expenses.",
      });
    }

    group.expenseTitle = title;
    group.totalExpense = Number(amount);

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("owner", "name")
      .populate("members", "name");

    res.status(200).json({
      message: "Expense updated successfully.",
      group: updatedGroup,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  addMember,
  addExpense,
};