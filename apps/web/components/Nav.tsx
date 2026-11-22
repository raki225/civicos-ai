"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Check, ChevronDown, Languages, Menu, Moon, ShieldCheck, Sun, Volume2, VolumeX, X } from "lucide-react";
import { languageOptions, usePreferences } from "@/components/PreferencesProvider";

export function Nav() {
  const pathname = usePathname();
  const { language, setLanguage, theme, toggleTheme, t, voiceSupported, isSpeaking, readPage, stopSpeaking } = usePreferences();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeLanguage = languageOptions.find((item) => item.code === language) ?? languageOptions[0];

  useEffect(() => {
    setMobileOpen(false);
    setLanguageOpen(false);
  }, [pathname]);

  const links = [
    { href: "/report", label: t("nav.report") },
    { href: "/track", label: t("nav.track") },
    { href: "/public-dashboard", label: t("nav.dashboard") },
    { href: "/officer", label: t("nav.officer") },
  ];

  return (
    <header className="nav-shell" data-no-speech>
      <nav className="nav container" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="CivicOS AI home">
          <span className="brand-mark"><Building2 size={20} /></span>
          <span>CivicOS <em>AI</em></span>
        </Link>

        <div className="nav-links">
          {links.map((link) => <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href}>{link.label}</Link>)}
        </div>

        <div className="nav-actions" aria-label="Preferences">
          <div className="preference-menu">
            <button className="preference-button language-button" onClick={() => setLanguageOpen((open) => !open)} aria-expanded={languageOpen} aria-haspopup="listbox" aria-label={t("nav.changeLanguage")}>
              <Languages size={17} /><span>{activeLanguage.shortLabel}</span><ChevronDown size={13} />
            </button>
            {languageOpen && <div className="language-popover" role="listbox" aria-label={t("nav.changeLanguage")}>
              <div className="popover-label">{t("nav.changeLanguage")}</div>
              {languageOptions.map((option) => <button key={option.code} role="option" aria-selected={language === option.code} onClick={() => { setLanguage(option.code); setLanguageOpen(false); }}><span>{option.label}</span>{language === option.code && <Check size={16} />}</button>)}
            </div>}
          </div>
          <button className="icon-button" onClick={isSpeaking ? stopSpeaking : readPage} disabled={!voiceSupported} aria-label={isSpeaking ? t("nav.stop") : t("nav.listen")} title={voiceSupported ? (isSpeaking ? t("nav.stop") : t("nav.listen")) : t("voice.unsupported")}>
            {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button className="icon-button theme-button" onClick={toggleTheme} aria-label={theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")} title={theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <span className="trust"><ShieldCheck size={15} /> {t("nav.secure")}</span>
          <button className="icon-button menu-button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={mobileOpen ? t("nav.close") : t("nav.menu")}>
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>
      {mobileOpen && <div className="mobile-nav container">
        {links.map((link) => <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href}>{link.label}<span>→</span></Link>)}
        <div className="mobile-trust"><ShieldCheck size={16} /> {t("nav.secure")}</div>
      </div>}
    </header>
  );
}
