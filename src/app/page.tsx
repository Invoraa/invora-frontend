import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-brand-50 to-white">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium">
          Built on Stellar · Powered by Soroban
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Invoice anyone,{" "}
          <span className="text-brand-600">on-chain.</span>
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          Invora lets freelancers and businesses create cryptographically verifiable invoices,
          lock payments in escrow, and release funds by milestone — all on the Stellar network.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/Invoraa"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            View on GitHub
          </a>
        </div>
        <div className="pt-8 grid grid-cols-3 gap-6 text-center">
          {[
            { label: "Escrow-backed", icon: "🔒" },
            { label: "Milestone payments", icon: "🎯" },
            { label: "Multi-currency", icon: "💱" },
          ].map((f) => (
            <div key={f.label} className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-sm font-medium text-gray-700">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}