import { useEffect, useState } from "react";
import { useLeadStore } from "../store/leadStore";
import { StatsCard } from "./statsCard";
import { LeadCard } from "./LeadCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Sparkles,
  Loader2,
  AlertCircle, // ADD THIS IMPORT
} from "lucide-react";
import { qualifyLeadsBatch } from "../services/aiService";
import { Card } from "./ui/card";

export function Dashboard() {
  const {
    leads,
    stats,
    initializeLeads,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    getFilteredLeads,
    updateLeadQualification,
  } = useLeadStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState({
    current: 0,
    total: 0,
  });

  useEffect(() => {
    initializeLeads();
  }, [initializeLeads]);

  const filteredLeads = getFilteredLeads();
  const pendingLeads = leads.filter((l) => !l.qualification);

  const handleQualifyAll = async () => {
    if (pendingLeads.length === 0) return;

    setIsProcessing(true);
    setProcessProgress({ current: 0, total: pendingLeads.length });

    try {
      const results = await qualifyLeadsBatch(pendingLeads, (current, total) =>
        setProcessProgress({ current, total })
      );

      // Update store with results
      results.forEach((qualification, leadId) => {
        updateLeadQualification(leadId, qualification);
      });
    } catch (error) {
      console.error("Batch qualification failed:", error);
      alert("Failed to process some leads. Check console for details.");
    } finally {
      setIsProcessing(false);
      setProcessProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Lead Qualifier
            </h1>
            <p className="text-muted-foreground">
              AI-powered lead triage dashboard
            </p>
          </div>

          {pendingLeads.length > 0 && (
            <Button
              onClick={handleQualifyAll}
              disabled={isProcessing}
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing {processProgress.current}/{processProgress.total}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Qualify {pendingLeads.length} Pending Leads
                </>
              )}
            </Button>
          )}
        </div>

        {/* Stats - UPDATE THIS GRID */}
        <div className="grid gap-4 md:grid-cols-5">
          <StatsCard
            title="Total Leads"
            value={stats.total}
            icon={Users}
            description="All time"
          />
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            icon={Clock}
            description="Awaiting qualification"
          />
          <StatsCard
            title="Qualified"
            value={stats.qualified}
            icon={CheckCircle2}
            description="Ready to contact"
          />
          <StatsCard
            title="Needs Review"
            value={stats.reviewing}
            icon={AlertCircle}
            description="Moderate potential"
          />
          <StatsCard
            title="Disqualified"
            value={stats.disqualified}
            icon={XCircle}
            description="Not worth pursuing"
          />
        </div>

        {/* Secondary Stats Row - OPTIONAL BUT NICE */}
        {/* <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Avg. Score"
            value={stats.avgScore.toFixed(0)}
            icon={Sparkles}
            description="Out of 100"
          />
          <StatsCard
            title="Conversion Rate"
            value={
              stats.total > 0
                ? `${((stats.qualified / stats.total) * 100).toFixed(1)}%`
                : "0%"
            }
            icon={CheckCircle2}
            description="Qualified / Total"
          />
          <StatsCard
            title="Action Needed"
            value={stats.pending + stats.reviewing}
            icon={AlertCircle}
            description="Pending + Reviewing"
          />
        </div> */}

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="qualified">Qualified</TabsTrigger>
              <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
              <TabsTrigger value="disqualified">Disqualified</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Lead List */}
        <div className="space-y-4">
          {filteredLeads.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leads found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Leads will appear here as they come in"}
              </p>
            </Card>
          ) : (
            filteredLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </div>
      </div>
    </div>
  );
}
