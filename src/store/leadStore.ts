import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lead, LeadStats } from "../lib/types";
import { calculateStats } from "../lib/utils";
import { mockLeads } from "../lib/mockData";

interface LeadStore {
  leads: Lead[];
  stats: LeadStats;

  // Actions
  initializeLeads: () => void;
  updateLeadQualification: (
    leadId: string,
    qualification: Lead["qualification"]
  ) => void;
  addManualOverride: (
    leadId: string,
    status: Exclude<Lead["qualification"], undefined>["status"],
    reason: string
  ) => void;
  updateNotes: (leadId: string, notes: string) => void;
  deleteLead: (leadId: string) => void;

  // NEW: Force stats recalculation
  recalculateStats: () => void;

  // Filters & Search
  filterStatus: "all" | "pending" | "qualified" | "disqualified";
  setFilterStatus: (status: LeadStore["filterStatus"]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Computed
  getFilteredLeads: () => Lead[];
}

export const useLeadStore = create<LeadStore>()(
  persist(
    (set, get) => ({
      leads: [],
      stats: {
        total: 0,
        pending: 0,
        qualified: 0,
        disqualified: 0,
        avgScore: 0,
      },
      filterStatus: "all",
      searchQuery: "",

      initializeLeads: () => {
        const { leads } = get();
        // Only initialize if empty (first load)
        if (leads.length === 0) {
          const processedLeads = mockLeads.map((lead) => ({
            ...lead,
            timestamp: new Date(lead.timestamp), // Ensure Date objects
          }));
          set({
            leads: processedLeads,
            stats: calculateStats(processedLeads),
          });
        } else {
          // IMPORTANT: Recalculate stats on reload
          get().recalculateStats();
        }
      },

      recalculateStats: () => {
        const { leads } = get();
        set({ stats: calculateStats(leads) });
      },

      updateLeadQualification: (leadId, qualification) => {
        const { leads } = get();
        const updatedLeads = leads.map((lead) =>
          lead.id === leadId ? { ...lead, qualification } : lead
        );
        set({
          leads: updatedLeads,
          stats: calculateStats(updatedLeads),
        });
      },

      addManualOverride: (leadId, status, reason) => {
        const { leads } = get();
        const updatedLeads = leads.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                manualOverride: {
                  status,
                  reason,
                  timestamp: new Date(),
                },
              }
            : lead
        );
        set({
          leads: updatedLeads,
          stats: calculateStats(updatedLeads),
        });
      },

      updateNotes: (leadId, notes) => {
        const { leads } = get();
        const updatedLeads = leads.map((lead) =>
          lead.id === leadId ? { ...lead, notes } : lead
        );
        set({ leads: updatedLeads });
      },

      deleteLead: (leadId) => {
        const { leads } = get();
        const updatedLeads = leads.filter((lead) => lead.id !== leadId);
        set({
          leads: updatedLeads,
          stats: calculateStats(updatedLeads),
        });
      },

      setFilterStatus: (filterStatus) => set({ filterStatus }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      getFilteredLeads: () => {
        const { leads, filterStatus, searchQuery } = get();

        let filtered = leads;

        // Apply status filter
        if (filterStatus !== "all") {
          filtered = filtered.filter((lead) => {
            const effectiveStatus =
              lead.manualOverride?.status || lead.qualification?.status;
            return effectiveStatus === filterStatus;
          });
        }

        // Apply search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (lead) =>
              lead.rawData.name?.toLowerCase().includes(query) ||
              lead.rawData.email?.toLowerCase().includes(query) ||
              lead.rawData.company?.toLowerCase().includes(query) ||
              lead.rawData.message.toLowerCase().includes(query)
          );
        }

        // Sort by timestamp (newest first)
        return filtered.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      },
    }),
    {
      name: "lead-qualifier-storage",
      partialize: (state) => ({
        leads: state.leads,
        // Don't persist UI state like filters
      }),
      // NEW: Hook into rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recalculate stats after localStorage loads
          state.stats = calculateStats(state.leads);
        }
      },
    }
  )
);
