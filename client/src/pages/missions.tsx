import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMissionStore } from "@/lib/mission-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  Filter,
  Plane,
  Users,
  Package,
  MapPin,
  Clock,
  Calendar,
  Eye
} from "lucide-react";

interface Mission {
  id: number;
  missionNumber: string;
  missionType: string;
  status: "In Progress" | "Completed" | "Deployment" | "Planning";
  dateRange: string;
  legs: number;
  pax: number;
  cargo: number;
  aircraftType?: string;
  createdAt: string;
  photos?: string[];
  notes?: string;
}

export default function Missions() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const { missions, isLoading, fetchMissions, updateMission } = useMissionStore();

  // Load missions on component mount
  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const filteredMissions = missions.filter((mission: Mission) => {
    const matchesSearch = mission.missionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.missionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.dateRange.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || mission.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Deployment": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Planning": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const handleViewMission = (missionId: number) => {
    setLocation(`/mission/${missionId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="p-4 space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.history.back()}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Mission History</h1>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search missions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400 h-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const statuses = ["All", "In Progress", "Completed", "Deployment", "Awaiting scan"];
              const currentIndex = statuses.indexOf(filterStatus);
              const nextIndex = (currentIndex + 1) % statuses.length;
              setFilterStatus(statuses[nextIndex]);
            }}
            className="border-slate-600 text-slate-300 h-10 px-3"
          >
            <Filter className="h-4 w-4 mr-1" />
            {filterStatus}
          </Button>
        </div>

        {/* Mission List */}
        <div className="space-y-4">
          {filteredMissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">No missions found</div>
              <Button onClick={() => setLocation('/mission-form')} className="bg-blue-600 hover:bg-blue-700">
                <Plane className="h-4 w-4 mr-2" />
                Create New Mission
              </Button>
            </div>
          ) : (
            filteredMissions.map((mission: Mission) => (
              <div key={mission.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:bg-slate-800/70 transition-colors cursor-pointer"
                   onClick={() => handleViewMission(mission.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Mission Icon */}
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                    
                    {/* Mission Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="text"
                          value={mission.missionNumber}
                          onChange={(e) => updateMission(mission.id, { missionNumber: e.target.value })}
                          className="font-semibold text-white text-lg bg-transparent border-b border-slate-600 focus:border-blue-400 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <select
                          value={mission.missionType}
                          onChange={(e) => updateMission(mission.id, { missionType: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-blue-400 focus:outline-none"
                        >
                          <option value="TDY">TDY</option>
                          <option value="Deployment">Deployment</option>
                          <option value="Training">Training</option>
                          <option value="Exercise">Exercise</option>
                        </select>
                      </div>
                      
                      {/* Date Range - Prominent Display */}
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <input
                          type="text"
                          value={mission.dateRange}
                          onChange={(e) => updateMission(mission.id, { dateRange: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-400 font-medium bg-transparent border-b border-slate-600 focus:border-blue-400 focus:outline-none"
                          placeholder="e.g., Dec 15-22, 2024"
                        />
                      </div>
                      
                      {/* Mission Stats */}
                      <div className="flex items-center gap-6 text-sm text-slate-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <input
                            type="number"
                            value={mission.pax}
                            onChange={(e) => updateMission(mission.id, { pax: parseInt(e.target.value) || 0 })}
                            onClick={(e) => e.stopPropagation()}
                            className="w-16 bg-transparent border-b border-slate-600 text-white text-sm focus:border-blue-400 focus:outline-none"
                          />
                          <span>PAX</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={mission.cargo}
                                onChange={(e) => updateMission(mission.id, { cargo: parseInt(e.target.value) || 0 })}
                                onClick={(e) => e.stopPropagation()}
                                className="w-20 bg-transparent border-b border-slate-600 text-white text-sm focus:border-blue-400 focus:outline-none"
                              />
                              <span>lbs</span>
                            </div>
                            {mission.cargo >= 2000 && (
                              <span className="text-xs text-slate-500">{(mission.cargo / 2000).toFixed(1)} tons</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <input
                            type="number"
                            value={mission.legs}
                            onChange={(e) => updateMission(mission.id, { legs: parseInt(e.target.value) || 0 })}
                            onClick={(e) => e.stopPropagation()}
                            className="w-12 bg-transparent border-b border-slate-600 text-white text-sm focus:border-blue-400 focus:outline-none"
                          />
                          <span>legs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Plane className="h-3 w-3" />
                          <select
                            value={mission.aircraftType || ''}
                            onChange={(e) => updateMission(mission.id, { aircraftType: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:border-blue-400 focus:outline-none"
                          >
                            <option value="">Select Aircraft</option>
                            <option value="C-17A">C-17A</option>
                            <option value="C-5M">C-5M</option>
                            <option value="C-130J">C-130J</option>
                            <option value="KC-135">KC-135</option>
                            <option value="KC-46">KC-46</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <select
                            value={mission.status}
                            onChange={(e) => updateMission(mission.id, { status: e.target.value as any })}
                            onClick={(e) => e.stopPropagation()}
                            className={`px-2 py-1 rounded-full text-xs font-medium border bg-slate-700 focus:outline-none focus:border-blue-400 ${getStatusColor(mission.status)}`}
                          >
                            <option value="Planning">Planning</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Deployment">Deployment</option>
                          </select>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMission(mission.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Footer */}
        {filteredMissions.length > 0 && (
          <div className="mt-8 bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
            <div className="text-center text-sm text-slate-400">
              Showing {filteredMissions.length} of {missions.length} missions
            </div>
          </div>
        )}
      </div>
    </div>
  );
}