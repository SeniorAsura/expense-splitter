export default function StatsCards({
  totalGroups,
  totalExpenses,
  totalOwed,
}) {
  const cards = [
    {
      title: "Groups",
      value: totalGroups,
      icon: "👥",
      color: "text-violet-400",
    },
    {
      title: "Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: "💰",
      color: "text-green-400",
    },
    {
      title: "You Owe",
      value: `$${totalOwed.toFixed(2)}`,
      icon: "💳",
      color: "text-red-400",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-lg hover:border-violet-500 transition"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-slate-400">{card.title}</h3>

            <span className="text-2xl">{card.icon}</span>
          </div>

          <h2 className={`mt-4 text-4xl font-bold ${card.color}`}>
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}