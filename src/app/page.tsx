import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const FEATURES = [
  { icon: "🧾", title: "On-chain Invoices", desc: "Every invoice is recorded on the Stellar blockchain — immutable, verifiable, and globally accessible." },
  { icon: "🔒", title: "Escrow Protection", desc: "Clients fund a Soroban escrow contract. Funds are locked until you approve the release — no chargebacks." },
  { icon: "🎯", title: "Milestone Payments", desc: "Break large projects into stages. Release funds per milestone, keeping both parties aligned." },
  { icon: "💱", title: "Multi-currency", desc: "Invoice and settle in USDC for stable pricing, or XLM for ultra-low fees — your choice." },
  { icon: "⚡", title: "Instant Settlement", desc: "Stellar settles in 3–5 seconds. No bank delays, no weekends, no wire transfers." },
  { icon: "🌍", title: "Borderless by Default", desc: "Works anywhere in the world. No country restrictions, no intermediaries, no compliance gatekeeping." },
];

const STEPS = [
  { n: "01", title: "Connect Wallet", desc: "Link your Freighter or xBull wallet — takes 10 seconds." },
  { n: "02", title: "Create Invoice", desc: "Add line items, set a due date, and optionally define milestones." },
  { n: "03", title: "Client Pays to Escrow", desc: "Your client funds the Soroban escrow contract on Stellar." },
  { n: "04", title: "Approve & Receive", desc: "Confirm delivery and release funds directly to your wallet." },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 via-white to-white py-24 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium">
              🌟 Built on Stellar · Powered by Soroban
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Invoice anyone,{" "}
              <span className="text-brand-600">on-chain.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Invora lets freelancers and businesses create cryptographically verifiable invoices,
              lock payments in escrow, and release funds by milestone — all on the Stellar network.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/dashboard" className="px-7 py-3.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors text-lg">
                Get Started — it&apos;s free
              </Link>
              <a href="https://github.com/Invoraa" target="_blank" rel="noopener noreferrer" className="px-7 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-lg">
                View on GitHub ↗
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4 text-sm text-gray-400">
              <span>✓ Open source</span>
              <span>✓ Non-custodial</span>
              <span>✓ Stellar Testnet & Mainnet</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need to get paid on-chain</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((s) => (
                <div key={s.n} className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-bold text-lg flex items-center justify-center mx-auto mb-4">{s.n}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-brand-600">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get paid faster?</h2>
            <p className="text-brand-100 mb-8">Join the open-source movement to bring professional invoicing to Web3.</p>
            <Link href="/dashboard" className="inline-block px-8 py-4 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 transition-colors text-lg">
              Launch App
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-gray-100 text-center text-sm text-gray-400">
          <p>Invora is open source — <a href="https://github.com/Invoraa" className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">github.com/Invoraa</a> · Built on <a href="https://stellar.org" className="hover:underline" target="_blank" rel="noopener noreferrer">Stellar</a></p>
        </footer>
      </main>
    </>
  );
}