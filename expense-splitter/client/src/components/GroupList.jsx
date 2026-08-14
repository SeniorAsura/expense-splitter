import { useNavigate } from "react-router-dom";

export default function GroupList({ groups }) {
  const navigate = useNavigate();

  if (groups.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
        <h2 className="text-2xl font-semibold text-white">
          No Groups Yet
        </h2>

        <p className="mt-2 text-slate-400">
          Click{" "}
          <span className="font-semibold text-violet-400">
            + Create Group
          </span>{" "}
          to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Your Groups
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group._id}
            onClick={() => navigate(`/groups/${group._id}`)}
            className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:scale-[1.02] hover:border-violet-500"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                🏠 {group.name}
              </h3>

              <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                {group.currency}
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-400">
              {group.description || "No description"}
            </p>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
              <span>
                👥 {group.members.length} Member
                {group.members.length !== 1 ? "s" : ""}
              </span>

              <span>
                👑 {group.owner?.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}