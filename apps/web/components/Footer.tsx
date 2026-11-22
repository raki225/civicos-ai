"use client";

import { Building2 } from "lucide-react";
import { usePreferences } from "@/components/PreferencesProvider";

export function Footer() {
  const { t } = usePreferences();
  return (
    <footer className="footer-shell">
      <div className="footer container">
        <span className="footer-brand"><Building2 size={15} /> CivicOS AI · {t("footer.tagline")}</span>
        <span>{t("footer.links")}</span>
      </div>
    </footer>
  );
}
