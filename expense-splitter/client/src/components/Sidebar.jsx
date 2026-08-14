import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen p-6">
      <h1 className="text-2xl font-bold text-violet-400 mb-10">
        💰 Expense Splitter
      </h1>

      <nav className="space-y-3">
        <Link
          to="/dashboard"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/groups"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
        >
          👥 Groups
        </Link>

        <Link
          to="/expenses"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
        >
          💸 Expenses
        </Link>

        <Link
          to="/settlements"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
        >
          🤝 Settlements
        </Link>

        <Link
          to="/analytics"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
        >
          📊 Analytics
        </Link>

        <Link
          to="/settings"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
        >
          ⚙️ Settings
        </Link>
      </nav>
    </aside>
  );
}