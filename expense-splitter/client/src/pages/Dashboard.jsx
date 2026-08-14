import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import GroupList from "../components/GroupList";
import CreateGroupModal from "../components/CreateGroupModal";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchGroups = async () => {
    try {
      const res = await API.get("/groups");
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="mx-auto max-w-7xl p-8">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold">
              Welcome back, {user?.name}! 👋
            </h2>

            <p className="mt-2 text-slate-400">
              Manage your shared expenses with ease.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-700"
          >
            + Create Group
          </button>

        </div>

        <StatsCards
          totalGroups={groups.length}
          totalExpenses={0}
          totalOwed={0}
        />

        <GroupList groups={groups} />

      </main>

      <CreateGroupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onGroupCreated={fetchGroups}
      />

    </div>
  );
}

export default Dashboard;