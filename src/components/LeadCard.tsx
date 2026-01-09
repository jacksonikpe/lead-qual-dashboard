import { useState } from "react";
import type { Lead } from "../lib/types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Mail,
  Building,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Phone,
} from "lucide-react";
import { formatTimestamp, getSourceColor, getStatusColor } from "../lib/utils";
import { useLeadStore } from "../store/leadStore";

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [overrideAction, setOverrideAction] = useState<
    "qualified" | "disqualified"
  >("qualified");

  const { addManualOverride, updateNotes } = useLeadStore();

  const effectiveStatus =
    lead.manualOverride?.status || lead.qualification?.status || "pending";
  const effectiveReasoning =
    lead.manualOverride?.reason || lead.qualification?.reasoning;

  const handleOverride = () => {
    if (overrideReason.trim()) {
      addManualOverride(lead.id, overrideAction, overrideReason);
      setShowOverrideDialog(false);
      setOverrideReason("");
    }
  };

  const openOverrideDialog = (action: "qualified" | "disqualified") => {
    setOverrideAction(action);
    setShowOverrideDialog(true);
  };

  return (
    <>
      <Card className="p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">
                {lead.rawData.name || "Anonymous"}
              </h3>
              <Badge className={getSourceColor(lead.source)}>
                {lead.source}
              </Badge>
              {effectiveStatus !== "pending" && (
                <Badge className={getStatusColor(lead.qualification)}>
                  {effectiveStatus}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {lead.rawData.company && (
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {lead.rawData.company}
                </div>
              )}
              {lead.rawData.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {lead.rawData.email}
                </div>
              )}
              {lead.rawData.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {lead.rawData.phone}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTimestamp(new Date(lead.timestamp))}
              </div>
            </div>
          </div>

          {lead.qualification && (
            <div className="text-right">
              <div className="text-2xl font-bold">
                {lead.qualification.score}
              </div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
          )}
        </div>

        {/* Message Preview */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {lead.rawData.message}
          </p>
        </div>

        {/* AI Reasoning */}
        {effectiveReasoning && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <p className="text-sm">{effectiveReasoning}</p>
            </div>
            {lead.manualOverride && (
              <Badge variant="outline" className="mt-2">
                Manual Override
              </Badge>
            )}
          </div>
        )}

        {/* BANT Signals */}
        {lead.qualification?.signals && (
          <div className="flex gap-2 mb-4">
            {lead.qualification.signals.hasBudget && (
              <Badge variant="outline">💰 Budget</Badge>
            )}
            {lead.qualification.signals.hasAuthority && (
              <Badge variant="outline">👤 Authority</Badge>
            )}
            {lead.qualification.signals.hasNeed && (
              <Badge variant="outline">🎯 Need</Badge>
            )}
            {lead.qualification.signals.hasTimeline && (
              <Badge variant="outline">⏰ Timeline</Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(true)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>

          {effectiveStatus !== "qualified" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => openOverrideDialog("qualified")}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Qualify
            </Button>
          )}

          {effectiveStatus !== "disqualified" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => openOverrideDialog("disqualified")}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Disqualify
            </Button>
          )}
        </div>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{lead.rawData.name || "Lead Details"}</DialogTitle>
            <DialogDescription>
              Complete information and AI analysis
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Full Message */}
            <div>
              <h4 className="font-semibold mb-2">Message</h4>
              <p className="text-sm whitespace-pre-wrap">
                {lead.rawData.message}
              </p>
            </div>

            {/* Extracted Data */}
            {lead.qualification?.extractedData && (
              <div>
                <h4 className="font-semibold mb-2">Extracted Information</h4>
                <div className="space-y-2 text-sm">
                  {lead.qualification.extractedData.budgetRange && (
                    <div>
                      <span className="font-medium">Budget:</span>{" "}
                      {lead.qualification.extractedData.budgetRange}
                    </div>
                  )}
                  {lead.qualification.extractedData.timeline && (
                    <div>
                      <span className="font-medium">Timeline:</span>{" "}
                      {lead.qualification.extractedData.timeline}
                    </div>
                  )}
                  {lead.qualification.extractedData.role && (
                    <div>
                      <span className="font-medium">Role:</span>{" "}
                      {lead.qualification.extractedData.role}
                    </div>
                  )}
                  {lead.qualification.extractedData.painPoints.length > 0 && (
                    <div>
                      <span className="font-medium">Pain Points:</span>
                      <ul className="list-disc list-inside ml-4">
                        {lead.qualification.extractedData.painPoints.map(
                          (point, i) => (
                            <li key={i}>{point}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <Textarea
                placeholder="Add notes about this lead..."
                value={lead.notes || ""}
                onChange={(e) => updateNotes(lead.id, e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Override Dialog */}
      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {overrideAction === "qualified"
                ? "Qualify Lead"
                : "Disqualify Lead"}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for this decision
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="e.g., Strong budget signal, decision-maker confirmed via LinkedIn..."
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            rows={4}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowOverrideDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleOverride} disabled={!overrideReason.trim()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
