import { useState } from "react";
import API from "../services/api";

export default function CreateGroupModal({
  isOpen,
  onClose,
  onGroupCreated,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    currency: "USD",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/groups", form);

      setForm({
        name: "",
        description: "",
        currency: "USD",
      });

      onGroupCreated();
      onClose();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to create group."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Create Group
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-1 block text-slate-300">
              Group Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-slate-300">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-slate-300">
              Currency
            </label>

            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>NGN</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-700 px-5 py-2 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-violet-600 px-5 py-2 text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}