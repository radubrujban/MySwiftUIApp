import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Shield, 
  Lock, 
  Database, 
  HardDrive,
  CheckCircle,
  Plane,
  Users,
  Package,
  Eye,
  Settings,
  Trash2
} from "lucide-react";
import { useLocation } from "wouter";
import { useMissionStore } from "@/lib/mission-store";
import NewMissionModal from "@/components/modals/new-mission-modal";

interface Mission {
  id: number;
  missionNumber: string;
  missionType: string;
  status: "In Progress" | "Completed" | "Deployment" | "Awaiting scan";
  dateRange: string;
  legs: number;
  pax: number;
  cargo: number;
  aircraftType?: string;
  createdAt: string;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [showMissionModal, setShowMissionModal] = useState(false);
  const { missions, stats, isLoading, fetchMissions, deleteMission } = useMissionStore();

  // Load missions on component mount
  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  // Simplified security status - no complex calculations needed
  const securityActive = true;



  const handleCreateMission = () => {
    setShowMissionModal(true);
  };

  const handleDeleteMission = async (missionId: number, missionNumber: string) => {
    if (!confirm(`Are you sure you want to delete mission ${missionNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      const success = await deleteMission(missionId);
      if (!success) {
        alert('Failed to delete mission. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting mission:', error);
      alert('Error deleting mission. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Deployment": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Awaiting scan": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getMissionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "deployment": return "✈️";
      case "training": return "🎯";
      case "cargo": return "📦";
      default: return "🚁";
    }
  };

  // Helper function to format cargo weight
  const formatCargoWeight = (weightLbs: number) => {
    const tons = weightLbs / 2000;
    if (tons >= 1) {
      return {
        primary: `${weightLbs.toLocaleString()}`,
        secondary: `${tons.toFixed(1)} tons`
      };
    }
    return {
      primary: `${weightLbs.toLocaleString()}`,
      secondary: null
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Scrollable content - removed sticky positioning */}
      <div className="p-4 space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button 
            onClick={() => setLocation('/settings')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5 text-slate-400" />
          </button>
        </div>
        
        {/* Mission Statistics Overview */}
        <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/50 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Plane className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Mission Overview</h2>
              <p className="text-xs text-slate-400">Comprehensive mission statistics</p>
            </div>
          </div>
          
          {/* Primary Stats */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800/60 rounded-lg p-4 text-center border border-blue-500/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Database className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">Total Missions</span>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-1">{stats.totalMissions}</div>
              <div className="text-xs text-slate-500">Active operations</div>
            </div>
            
            <div className="bg-slate-800/60 rounded-lg p-4 text-center border border-green-500/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Plane className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-300">Flight Legs</span>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-1">{stats.totalLegs}</div>
              <div className="text-xs text-slate-500">Completed segments</div>
            </div>
          </div>
          
          {/* Secondary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-800/40 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-400">{stats.totalPax.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Total PAX</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-orange-400">{formatCargoWeight(stats.totalCargo).primary}</div>
              <div className="text-xs text-slate-400">
                Cargo (lbs)
                {formatCargoWeight(stats.totalCargo).secondary && (
                  <div className="text-xs text-slate-500 mt-1">{formatCargoWeight(stats.totalCargo).secondary}</div>
                )}
              </div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-400">{stats.totalFlightHours.toFixed(1)}</div>
              <div className="text-xs text-slate-400">Flight Hours</div>
            </div>
          </div>
          
          {/* Additional Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/40 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-yellow-400">{stats.inProgress}</div>
              <div className="text-xs text-slate-400">In Progress</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-400">0</div>
              <div className="text-xs text-slate-400">TDY Days</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-cyan-400">
                {missions.reduce((acc, mission) => {
                  if (mission.flightLegs) {
                    return acc + mission.flightLegs.reduce((legAcc, leg: any) => legAcc + (leg.distanceNm || 0), 0);
                  }
                  return acc;
                }, 0).toFixed(1)}
              </div>
              <div className="text-xs text-slate-400">Miles Flown (NM)</div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleCreateMission}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Mission
          </Button>
          
          <Button
            onClick={() => setLocation('/missions')}
            variant="outline"
            className="w-full h-12 text-base font-semibold border-slate-600 hover:bg-slate-800"
          >
            <Eye className="h-5 w-5 mr-2" />
            View Missions
          </Button>
        </div>





        {/* Recent Missions Section */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Missions</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation('/missions')}
              className="text-slate-400 hover:text-white"
            >
              View All
            </Button>
          </div>
          
          {missions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No missions created yet</p>
              <p className="text-xs mt-1">Create your first mission to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {missions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 3)
                .map((mission) => (
                  <div 
                    key={mission.id} 
                    className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50 hover:bg-slate-700/70 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => setLocation(`/mission/${mission.id}`)}
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Plane className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-sm">{mission.missionNumber}</h4>
                          <p className="text-xs text-slate-400">{mission.missionType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                            <Users className="h-3 w-3" />
                            {mission.pax}
                            <Package className="h-3 w-3 ml-2" />
                            {mission.cargo}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            mission.status === "In Progress" ? "bg-blue-500/20 text-blue-400" :
                            mission.status === "Completed" ? "bg-green-500/20 text-green-400" :
                            mission.status === "Deployment" ? "bg-orange-500/20 text-orange-400" :
                            "bg-purple-500/20 text-purple-400"
                          }`}>
                            {mission.status}
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMission(mission.id, mission.missionNumber);
                          }}
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0 bg-red-600/20 hover:bg-red-600 border-red-600/50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Simplified Security Status */}
        <div className="mt-8 bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3 text-green-400" />
              <span className="text-xs font-medium text-slate-300">Security</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-400">
              <CheckCircle className="h-3 w-3" />
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mission Creation Modal */}
      <NewMissionModal 
        isOpen={showMissionModal} 
        onClose={() => setShowMissionModal(false)} 
      />
    </div>
  );
}