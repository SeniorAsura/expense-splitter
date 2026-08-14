import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold text-violet-400">
          💰 Expense Splitter
        </h1>

        <p className="text-sm text-slate-400">
          Manage shared expenses easily
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-white">
            {user?.name}
          </p>

          <p className="text-sm text-slate-400">
            {user?.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}