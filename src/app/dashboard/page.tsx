export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your invoices and payments</p>
          </div>
          <a
            href="/invoice/new"
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
          >
            + New Invoice
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Invoiced", value: "0 USDC", color: "text-gray-900" },
            { label: "Pending", value: "0", color: "text-yellow-600" },
            { label: "Paid", value: "0", color: "text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-400 text-lg">No invoices yet.</p>
          <p className="text-gray-400 text-sm mt-1">Connect your Stellar wallet to get started.</p>
        </div>
      </div>
    </main>
  );
}