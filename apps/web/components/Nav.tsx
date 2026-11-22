import Link from "next/link";
import { Building2, Languages, Moon, ShieldCheck } from "lucide-react";

export function Nav() {
  return (
    <header className="nav-shell">
      <nav className="nav container" aria-label="Primary navigation">
        <Link className="brand" href="/">
          <span className="brand-mark"><Building2 size={20} /></span>
          <span>CivicOS <em>AI</em></span>
        </Link>
        <div className="nav-links">
          <Link href="/report">Report an issue</Link>
          <Link href="/track">Track</Link>
          <Link href="/public-dashboard">Public dashboard</Link>
          <Link href="/officer">Officer</Link>
        </div>
        <div className="nav-actions" aria-label="Preferences">
          <button className="icon-button" aria-label="Change language"><Languages size={18} /></button>
          <button className="icon-button" aria-label="Toggle theme"><Moon size={18} /></button>
          <span className="trust"><ShieldCheck size={15} /> Secure</span>
        </div>
      </nav>
    </header>
  );
}

