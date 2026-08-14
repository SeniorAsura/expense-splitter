const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    currency: {
      type: String,
      default: "USD",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    totalExpense: {
  type: Number,
  default: 0,
},

expenseTitle: {
  type: String,
  default: "",
},

    settings: {
      allowGuestMembers: {
        type: Boolean,
        default: true,
      },

      onlyOwnerCanAddMembers: {
        type: Boolean,
        default: false,
      },

      onlyOwnerCanAddExpenses: {
        type: Boolean,
        default: false,
      },

      membersCanInvite: {
        type: Boolean,
        default: true,
      },

      requireInviteApproval: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Group", groupSchema);