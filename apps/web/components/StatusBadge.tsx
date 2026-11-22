"use client";

import { usePreferences } from "@/components/PreferencesProvider";

export function StatusBadge({ value }: { value: string }) {
  const { labelFor } = usePreferences();
  return <span className={`badge badge-${value.replaceAll("_", "-")}`}>{labelFor(value)}</span>;
}
