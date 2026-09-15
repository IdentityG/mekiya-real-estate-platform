"use client";

import { useState, useMemo } from "react";
import { 
  Flame, TrendingUp, TrendingDown, Clock, 
  Phone, Mail, MessageCircle, Search, Filter,
  Calendar, ArrowUpDown, Eye, Star, AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Lead {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  leadType: string;
  pipelineStatus: string;
  source: string | null;
  leadScore: number | null;
  lastActivityAt: Date | null;
  viewCount: number | null;
  whatsappOptIn: boolean | null;
  nextFollowUpDate: Date | null;
  budgetMin: number | null;
  budgetMax: number | null;
  propertyId: number | null;
  propertyTitle: string | null;
  assignedAgentId: number | null;
  agentName: string | null;
  interestedPropertyTypes: string[] | null;
  preferredNeighborhoods: string[] | null;
  createdAt: Date;
}

interface Agent {
  id: number;
  name: string;
  phone: string | null;
  whatsappPhone: string | null;
}

interface Activity {
  id: number;
  leadId: number;
  leadName: string | null;
  activityType: string;
  propertyId: number | null;
  propertyTitle: string | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
}

interface Stats {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  newLeads: number;
  activeLeads: number;
  needsFollowUp: number;
}

interface Props {
  leads: Lead[];
  agents: Agent[];
  stats: Stats;
  recentActivities: Activity[];
}

export function SmartLeadDashboard({ leads, agents, stats, recentActivities }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterScore, setFilterScore] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"score" | "activity" | "created">("score");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let filtered = leads;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query) ||
          lead.phone?.includes(query) ||
          lead.propertyTitle?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((lead) => lead.pipelineStatus === filterStatus);
    }

    // Score filter
    if (filterScore === "hot") {
      filtered = filtered.filter((lead) => (lead.leadScore || 0) >= 70);
    } else if (filterScore === "warm") {
      filtered = filtered.filter(
        (lead) => (lead.leadScore || 0) >= 40 && (lead.leadScore || 0) < 70
      );
    } else if (filterScore === "cold") {
      filtered = filtered.filter((lead) => (lead.leadScore || 0) < 40);
    }

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === "score") {
        return (b.leadScore || 0) - (a.leadScore || 0);
      } else if (sortBy === "activity") {
        const aTime = a.lastActivityAt?.getTime() || 0;
        const bTime = b.lastActivityAt?.getTime() || 0;
        return bTime - aTime;
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  }, [leads, searchQuery, filterStatus, filterScore, sortBy]);

  const getScoreBadge = (score: number | null) => {
    const s = score || 0;
    if (s >= 70)
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-600 text-xs font-body font-bold uppercase tracking-wider rounded">
          <Flame className="w-3 h-3" /> Hot
        </span>
      );
    if (s >= 40)
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-brass/10 text-brass text-xs font-body font-bold uppercase tracking-wider rounded">
          <TrendingUp className="w-3 h-3" /> Warm
        </span>
      );
    return (
      <span className="flex items-center gap-1 px-2 py-1 bg-slate/10 text-slate text-xs font-body font-bold uppercase tracking-wider rounded">
        <TrendingDown className="w-3 h-3" /> Cold
      </span>
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "property_view":
        return <Eye className="w-4 h-4 text-slate" />;
      case "property_favorite":
        return <Star className="w-4 h-4 text-brass" />;
      case "contact_whatsapp":
        return <MessageCircle className="w-4 h-4 text-[#25D366]" />;
      case "contact_phone":
        return <Phone className="w-4 h-4 text-ink" />;
      case "contact_email":
        return <Mail className="w-4 h-4 text-slate" />;
      case "search":
        return <Search className="w-4 h-4 text-stone-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-stone-400" />;
    }
  };

  const getActivityLabel = (type: string) => {
    const labels: Record<string, string> = {
      property_view: "Viewed property",
      property_favorite: "Favorited property",
      contact_whatsapp: "Contacted via WhatsApp",
      contact_phone: "Called",
      contact_email: "Sent email",
      visit_request: "Requested visit",
      search: "Searched properties",
      compare_properties: "Compared properties",
      agent_note: "Agent added note",
    };
    return labels[type] || type;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-ink text-3xl tracking-tight">Smart Lead Management</h1>
        <p className="text-stone-400 font-body text-sm mt-1">
          AI-powered lead scoring and activity tracking
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-ink/10 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone-400 text-xs font-body font-bold uppercase tracking-wider">
              Hot Leads
            </span>
            <Flame className="w-5 h-5 text-red-500" />
          </div>
          <p className="font-display text-3xl text-ink">{stats.hotLeads}</p>
          <p className="text-stone-400 text-[11px] font-body mt-1">Score ≥ 70</p>
        </div>

        <div className="bg-white border border-ink/10 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone-400 text-xs font-body font-bold uppercase tracking-wider">
              Warm Leads
            </span>
            <TrendingUp className="w-5 h-5 text-brass" />
          </div>
          <p className="font-display text-3xl text-ink">{stats.warmLeads}</p>
          <p className="text-stone-400 text-[11px] font-body mt-1">Score 40-69</p>
        </div>

        <div className="bg-white border border-ink/10 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone-400 text-xs font-body font-bold uppercase tracking-wider">
              Active (30d)
            </span>
            <Clock className="w-5 h-5 text-slate" />
          </div>
          <p className="font-display text-3xl text-ink">{stats.activeLeads}</p>
          <p className="text-stone-400 text-[11px] font-body mt-1">Recent activity</p>
        </div>

        <div className="bg-white border border-ink/10 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone-400 text-xs font-body font-bold uppercase tracking-wider">
              Follow-ups
            </span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="font-display text-3xl text-ink">{stats.needsFollowUp}</p>
          <p className="text-stone-400 text-[11px] font-body mt-1">Due or overdue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Leads List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="bg-white border border-ink/10 p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search leads by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-ink/10 text-sm font-body focus:outline-none focus:border-brass"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 border border-ink/10 text-xs font-body font-semibold uppercase tracking-wider focus:outline-none focus:border-brass"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="visit_scheduled">Visit Scheduled</option>
                <option value="negotiating">Negotiating</option>
              </select>

              <select
                value={filterScore}
                onChange={(e) => setFilterScore(e.target.value)}
                className="px-3 py-1.5 border border-ink/10 text-xs font-body font-semibold uppercase tracking-wider focus:outline-none focus:border-brass"
              >
                <option value="all">All Scores</option>
                <option value="hot">🔥 Hot (70+)</option>
                <option value="warm">📈 Warm (40-69)</option>
                <option value="cold">📉 Cold (&lt;40)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 border border-ink/10 text-xs font-body font-semibold uppercase tracking-wider focus:outline-none focus:border-brass"
              >
                <option value="score">Sort: Score</option>
                <option value="activity">Sort: Activity</option>
                <option value="created">Sort: Created</option>
              </select>

              <span className="ml-auto text-xs font-body text-stone-400 flex items-center">
                {filteredLeads.length} leads
              </span>
            </div>
          </div>

          {/* Leads list */}
          <div className="space-y-2">
            {filteredLeads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`w-full text-left bg-white border p-4 hover:border-brass transition-colors ${
                  selectedLead?.id === lead.id ? "border-brass bg-brass/5" : "border-ink/10"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body font-semibold text-ink truncate">{lead.name}</p>
                      {lead.whatsappOptIn && (
                        <MessageCircle className="w-3 h-3 text-[#25D366] shrink-0" />
                      )}
                    </div>
                    <p className="text-stone-400 text-xs font-body truncate">
                      {lead.email || lead.phone || "No contact info"}
                    </p>
                    {lead.propertyTitle && (
                      <p className="text-slate text-xs font-body mt-1 truncate">
                        Interested in: {lead.propertyTitle}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-body text-stone-400">
                        {lead.lastActivityAt
                          ? formatDistanceToNow(new Date(lead.lastActivityAt), {
                              addSuffix: true,
                            })
                          : "No activity"}
                      </span>
                      {lead.viewCount && lead.viewCount > 0 && (
                        <span className="text-[10px] font-body text-stone-400">
                          • {lead.viewCount} views
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {getScoreBadge(lead.leadScore)}
                    <div className="flex items-center gap-1">
                      <span className="font-display text-2xl text-ink">
                        {lead.leadScore || 0}
                      </span>
                      <span className="text-[10px] text-stone-400 font-body">/100</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {filteredLeads.length === 0 && (
              <div className="bg-white border border-ink/10 p-12 text-center">
                <Search className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="font-body text-stone-400">No leads found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Activity Feed & Lead Details */}
        <div className="space-y-4">
          {/* Selected Lead Details */}
          {selectedLead && (
            <div className="bg-white border border-ink/10 p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl text-ink">{selectedLead.name}</h3>
                  <p className="text-stone-400 text-xs font-body mt-0.5">
                    Lead #{selectedLead.id}
                  </p>
                </div>
                {getScoreBadge(selectedLead.leadScore)}
              </div>

              <div className="space-y-2 text-sm font-body">
                {selectedLead.email && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-4 h-4 text-stone-400" />
                    <span className="truncate">{selectedLead.email}</span>
                  </div>
                )}
                {selectedLead.phone && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-4 h-4 text-stone-400" />
                    <span>{selectedLead.phone}</span>
                  </div>
                )}
                {selectedLead.budgetMin && selectedLead.budgetMax && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <span className="text-stone-400">Budget:</span>
                    <span>
                      {selectedLead.budgetMin.toLocaleString()} -{" "}
                      {selectedLead.budgetMax.toLocaleString()} ETB
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-ink/5 space-y-2">
                <div className="flex justify-between text-xs font-body">
                  <span className="text-stone-400">Status:</span>
                  <span className="text-ink font-semibold uppercase tracking-wider">
                    {selectedLead.pipelineStatus}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-body">
                  <span className="text-stone-400">Source:</span>
                  <span className="text-ink">{selectedLead.source || "Unknown"}</span>
                </div>
                <div className="flex justify-between text-xs font-body">
                  <span className="text-stone-400">Agent:</span>
                  <span className="text-ink">{selectedLead.agentName || "Unassigned"}</span>
                </div>
                {selectedLead.lastActivityAt && (
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-stone-400">Last Activity:</span>
                    <span className="text-ink">
                      {formatDistanceToNow(new Date(selectedLead.lastActivityAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Activity Feed */}
          <div className="bg-white border border-ink/10 p-5">
            <h3 className="font-body font-semibold text-ink mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {recentActivities.slice(0, 20).map((activity) => (
                <div key={activity.id} className="flex gap-3 text-xs">
                  <div className="shrink-0 mt-0.5">{getActivityIcon(activity.activityType)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-graphite">
                      <span className="font-semibold">{activity.leadName || "Anonymous"}</span>{" "}
                      {getActivityLabel(activity.activityType)}
                    </p>
                    {activity.propertyTitle && (
                      <p className="text-stone-400 truncate">{activity.propertyTitle}</p>
                    )}
                    <p className="text-stone-400 mt-0.5">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
