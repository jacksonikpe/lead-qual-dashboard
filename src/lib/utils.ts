import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Lead, LeadStats, QualificationStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateStats(leads: Lead[]): LeadStats {
  const total = leads.length;

  // Pending = no AI qualification AND no manual override
  const pending = leads.filter(
    (l) => !l.qualification && !l.manualOverride
  ).length;

  // Get effective status (manual override takes precedence)
  const getEffectiveStatus = (lead: Lead): QualificationStatus | null => {
    if (lead.manualOverride) return lead.manualOverride.status;
    if (lead.qualification) return lead.qualification.status;
    return null;
  };

  const qualified = leads.filter(
    (l) => getEffectiveStatus(l) === "qualified"
  ).length;

  const disqualified = leads.filter(
    (l) => getEffectiveStatus(l) === "disqualified"
  ).length;

  const reviewing = leads.filter(
    (l) => getEffectiveStatus(l) === "reviewing"
  ).length;

  const scoredLeads = leads.filter((l) => l.qualification?.score);
  const avgScore =
    scoredLeads.length > 0
      ? scoredLeads.reduce((sum, l) => sum + (l.qualification?.score || 0), 0) /
        scoredLeads.length
      : 0;

  return { total, pending, qualified, disqualified, reviewing, avgScore };
}

export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
}

export function getSourceColor(source: Lead["source"]): string {
  const colors = {
    email: "bg-blue-100 text-blue-800",
    typeform: "bg-green-100 text-green-800",
    whatsapp: "bg-emerald-100 text-emerald-800",
    linkedin: "bg-purple-100 text-purple-800",
  };
  return colors[source];
}

export function getStatusColor(status: Lead["qualification"]): string {
  if (!status) return "bg-gray-100 text-gray-800";

  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    qualified: "bg-green-100 text-green-800",
    disqualified: "bg-red-100 text-red-800",
    reviewing: "bg-blue-100 text-blue-800",
  };
  return colors[status.status];
}
