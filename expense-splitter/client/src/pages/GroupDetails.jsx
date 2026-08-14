import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Member
  const [showAddMember, setShowAddMember] = useState(false);
  const [email, setEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  // Add Expense
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [creatingExpense, setCreatingExpense] = useState(false);



  const [expenseForm, setExpenseForm] = useState({
    title: "",
    description: "",
    amount: "",
  });

  const fetchGroup = async () => {
    try {
      const res = await API.get(`/groups/${id}`);
      setGroup(res.data);
    } catch (err) {
      console.error(err);
      alert("Group not found.");
      navigate("/dashboard");
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await API.get(`/expenses/${id}`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!email.trim()) {
      return alert("Please enter an email.");
    }

    try {
      setAddingMember(true);

      await API.post(`/groups/${id}/add-member`, {
        email,
      });

      alert("Member added!");

      setEmail("");
      setShowAddMember(false);

      fetchGroup();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member.");
    } finally {
      setAddingMember(false);
    }
  };

  const handleCreateExpense = async () => {
    if (!expenseForm.title || !expenseForm.amount) {
      return alert("Title and amount are required.");
    }

    try {
      setCreatingExpense(true);

      await API.post("/expenses", {
        groupId: id,
        title: expenseForm.title,
        description: expenseForm.description,
        amount: Number(expenseForm.amount),
      });

      alert("Expense added.");

      setExpenseForm({
        title: "",
        description: "",
        amount: "",
      });

      setShowExpenseModal(false);

      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create expense.");
    } finally {
      setCreatingExpense(false);
    }
  };

  useEffect(() => {
    fetchGroup();
    fetchExpenses();
  }, [id]);

  const totalExpense = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
  }, [expenses]);

  const eachOwes = useMemo(() => {
    if (!group || group.members.length === 0) return 0;

    return totalExpense / group.members.length;
  }, [group, totalExpense]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Group not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="border-b border-slate-800 bg-slate-900">

        <div className="mx-auto flex max-w-6xl items-center justify-between p-6">

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold">
            🏠 {group.name}
          </h1>

          <span className="rounded-full bg-violet-600 px-4 py-2">
            {group.currency}
          </span>

        </div>

      </div>

      <div className="mx-auto max-w-6xl p-8">

        <div className="rounded-2xl bg-slate-900 p-6">

          <h2 className="text-xl font-bold">
            Description
          </h2>

          <p className="mt-3 text-slate-400">
            {group.description || "No description"}
          </p>

        </div>
                <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* Members */}
          <div className="rounded-2xl bg-slate-900 p-6">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Members ({group.members.length})
              </h2>

              <button
                onClick={() => setShowAddMember(true)}
                className="rounded-lg bg-violet-600 px-3 py-2 hover:bg-violet-700"
              >
                + Add
              </button>

            </div>

            <div className="mt-6 space-y-3">

              {group.members.map((member) => (

                <div
                  key={member._id}
                  className="flex items-center gap-3 rounded-xl bg-slate-800 p-4"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-bold">
                    {member.name[0].toUpperCase()}
                  </div>

                  <div>

                    <p className="font-semibold">
                      {member.name}
                    </p>

                    <p className="text-sm text-slate-400">
                      {member._id === group.owner._id
                        ? "Group Owner 👑"
                        : "Member"}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Expenses */}

          <div className="rounded-2xl bg-slate-900 p-6">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Expenses
              </h2>

              <button
                onClick={() => setShowExpenseModal(true)}
                className="rounded-lg bg-green-600 px-3 py-2 hover:bg-green-700"
              >
                + Add
              </button>

            </div>

            <div className="mt-6 space-y-3">

              {expenses.length === 0 ? (

                <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
                  No expenses yet.
                </div>

              ) : (

                expenses.map((expense) => (

                  <div
                    key={expense._id}
                    className="rounded-xl bg-slate-800 p-4"
                  >

                    <div className="flex justify-between">

                      <div>

                        <h3 className="font-semibold">
                          {expense.title}
                        </h3>

                        <p className="text-sm text-slate-400">
                          {expense.description || "No description"}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-lg font-bold text-green-400">
                          {group.currency} {expense.amount}
                        </p>

                        <p className="text-xs text-slate-500">
                          {expense.createdBy?.name}
                        </p>

                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

        {/* Balances */}

        <div className="mt-8 rounded-2xl bg-slate-900 p-6">

          <h2 className="text-xl font-bold">
            Balances
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3">

            <div className="rounded-xl bg-slate-800 p-5">

              <p className="text-slate-400">
                Total Expenses
              </p>

              <p className="mt-2 text-3xl font-bold">
                {group.currency} {totalExpense.toFixed(2)}
              </p>

            </div>

            <div className="rounded-xl bg-slate-800 p-5">

              <p className="text-slate-400">
                Members
              </p>

              <p className="mt-2 text-3xl font-bold">
                {group.members.length}
              </p>

            </div>

            <div className="rounded-xl bg-slate-800 p-5">

              <p className="text-slate-400">
                Each Owes
              </p>

              <p className="mt-2 text-3xl font-bold text-green-400">
                {group.currency} {eachOwes.toFixed(2)}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Add Member Modal */}

      {showAddMember && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">

          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6">

            <h2 className="text-2xl font-bold">
              Add Member
            </h2>

            <input
              className="mt-6 w-full rounded-xl bg-slate-800 p-3"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setShowAddMember(false)}
                className="rounded-xl bg-slate-700 px-5 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleAddMember}
                disabled={addingMember}
                className="rounded-xl bg-violet-600 px-5 py-2"
              >
                {addingMember ? "Adding..." : "Add"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Add Expense Modal */}

      {showExpenseModal && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/60">

          <div className="w-full max-w-lg rounded-2xl bg-slate-900 p-6">

            <h2 className="text-2xl font-bold">
              Add Expense
            </h2>

            <input
              className="mt-6 w-full rounded-xl bg-slate-800 p-3"
              placeholder="Expense title"
              value={expenseForm.title}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  title: e.target.value,
                })
              }
            />

            <textarea
              className="mt-4 w-full rounded-xl bg-slate-800 p-3"
              placeholder="Description"
              value={expenseForm.description}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  description: e.target.value,
                })
              }
            />

            <input
              type="number"
              className="mt-4 w-full rounded-xl bg-slate-800 p-3"
              placeholder="Amount"
              value={expenseForm.amount}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  amount: e.target.value,
                })
              }
            />

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setShowExpenseModal(false)}
                className="rounded-xl bg-slate-700 px-5 py-2"
              >
                Cancel
              </button>

              <button
                disabled={creatingExpense}
                onClick={handleCreateExpense}
                className="rounded-xl bg-green-600 px-5 py-2"
              >
                {creatingExpense ? "Saving..." : "Save Expense"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default GroupDetails;