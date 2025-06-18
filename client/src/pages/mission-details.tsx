import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Plane, 
  Clock, 
  Package, 
  Users, 
  MapPin,
  Calendar,
  FileText,
  Edit,
  Save,
  X
} from "lucide-react";
import { useMissionStore } from "@/lib/mission-store";
import MissionPhotoUpload from "@/components/mission-photo-upload";
import FlightLogManager from "@/components/flight-log-manager";
import { useToast } from "@/hooks/use-toast";

interface FlightLeg {
  id: string;
  legNumber: number;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  flightHours: number;
  tailNumber?: string;
  remarks?: string;
  pax?: number;
  cargo?: number;
}

interface FCCMember {
  id: string;
  name: string;
  rank: string;
  employeeNumber: string;
  sdap: boolean;
  megp: boolean;
  departureDate: string;
  returnDate: string;
  distinguishedVisitors: string;
}

interface MaintenancePersonnel {
  id: string;
  name: string;
  rank: string;
  employeeNumber: string;
  sdap: boolean;
  megp: boolean;
  departureDate: string;
  returnDate: string;
  fccMonitor: string;
}

interface AircraftCommander {
  name: string;
  rank: string;
  flyingSquadron: string;
}

interface CrewInfo {
  fccMembers: FCCMember[];
  maintenancePersonnel: MaintenancePersonnel[];
  aircraftCommander: AircraftCommander;
}

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
  flightLegs?: FlightLeg[];
  totalFlightHours?: number;
  crewInfo?: CrewInfo;
}

export default function MissionDetails() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/mission/:id');
  const { missions, updateMission } = useMissionStore();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedMission, setEditedMission] = useState<Mission | null>(null);

  const missionId = params?.id ? parseInt(params.id) : null;
  const mission = missions.find(m => m.id === missionId);

  useEffect(() => {
    if (mission) {
      setEditedMission({
        ...mission,
        photos: mission.photos || [],
        notes: mission.notes || ""
      });
    }
  }, [mission]);

  if (!mission || !editedMission) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Mission Not Found</h2>
          <p className="text-slate-400 mb-4">The requested mission could not be located.</p>
          <Button onClick={() => setLocation('/missions')} variant="outline">
            Back to Missions
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (editedMission) {
      updateMission(editedMission.id, editedMission);
      setIsEditing(false);
      toast({
        title: "Mission Updated",
        description: "Mission details have been saved successfully.",
      });
    }
  };

  const handleCancel = () => {
    setEditedMission(mission);
    setIsEditing(false);
  };

  const handlePhotosUpdate = (photos: string[]) => {
    if (editedMission) {
      const updated = { ...editedMission, photos };
      setEditedMission(updated);
      updateMission(editedMission.id, updated);
    }
  };

  const handleFlightLegsUpdate = (flightLegs: any[]) => {
    if (editedMission) {
      const totalFlightHours = flightLegs.reduce((acc, leg) => acc + (leg.flightHours || 0), 0);
      const updated = { ...editedMission, flightLegs, totalFlightHours };
      setEditedMission(updated);
      updateMission(editedMission.id, updated);
    }
  };

  const handleSaveMission = () => {
    if (editedMission) {
      updateMission(editedMission.id, editedMission);
      setIsEditing(false);
      toast({
        title: "Mission Notes Saved",
        description: "Your mission notes have been updated successfully.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Deployment": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Planning": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="p-4 space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{mission.missionNumber}</h1>
              <p className="text-sm text-slate-400">{mission.missionType}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(mission.status)}>
              {mission.status}
            </Badge>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mission Overview */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Mission Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Mission Name</Label>
                {isEditing ? (
                  <Input
                    value={editedMission.missionNumber}
                    onChange={(e) => setEditedMission({...editedMission, missionNumber: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    autoComplete="off"
                  />
                ) : (
                  <p className="text-white mt-1">{mission.missionNumber}</p>
                )}
              </div>
              
              <div>
                <Label className="text-slate-300">Mission Type</Label>
                {isEditing ? (
                  <select
                    value={editedMission.missionType}
                    onChange={(e) => setEditedMission({...editedMission, missionType: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white mt-1"
                  >
                    <option value="TDY">TDY</option>
                    <option value="Deployment">Deployment</option>
                    <option value="Training">Training</option>
                    <option value="Exercise">Exercise</option>
                  </select>
                ) : (
                  <p className="text-white mt-1">{mission.missionType}</p>
                )}
              </div>
              
              <div>
                <Label className="text-slate-300">Date Range</Label>
                {isEditing ? (
                  <Input
                    value={editedMission.dateRange}
                    onChange={(e) => setEditedMission({...editedMission, dateRange: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="e.g., Dec 15-22, 2024"
                  />
                ) : (
                  <p className="text-white mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    {mission.dateRange}
                  </p>
                )}
              </div>
              
              <div>
                <Label className="text-slate-300">Aircraft Type</Label>
                {isEditing ? (
                  <select
                    value={editedMission.aircraftType || ''}
                    onChange={(e) => setEditedMission({...editedMission, aircraftType: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white mt-1"
                  >
                    <option value="">Select Aircraft</option>
                    <option value="C-17A">C-17A</option>
                    <option value="C-5M">C-5M</option>
                    <option value="C-130J">C-130J</option>
                    <option value="KC-135">KC-135</option>
                    <option value="KC-46">KC-46</option>
                  </select>
                ) : (
                  <p className="text-white mt-1">{mission.aircraftType || 'Not specified'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Statistics */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Mission Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-300">Total PAX</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {(mission.flightLegs || []).reduce((acc, leg: any) => acc + (leg.pax || 0), 0)}
                </div>
                <div className="text-xs text-slate-500">From all flight legs</div>
              </div>
              
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-slate-300">Total Cargo</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {((mission.flightLegs || []).reduce((acc, leg: any) => acc + (leg.cargo || 0), 0)).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">Pounds from all legs</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Flight Hours</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {((mission.flightLegs || []).reduce((acc, leg: any) => acc + (leg.flightHours || 0), 0)).toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">From all legs</div>
              </div>
              
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm text-slate-300">Miles Flown</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  {((mission.flightLegs || []).reduce((acc, leg: any) => acc + (leg.distanceNm || 0), 0)).toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">Nautical miles</div>
              </div>
              
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-slate-300">TDY Days</span>
                </div>
                <div className="text-2xl font-bold text-red-400">0</div>
                <div className="text-xs text-slate-500">Days away</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flight Log */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Flight Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FlightLogManager
              missionId={mission.id}
              flightLegs={editedMission.flightLegs || []}
              onFlightLegsUpdate={handleFlightLegsUpdate}
              crewInfo={editedMission.crewInfo}
              onCrewInfoUpdate={(crewInfo) => {
                const updated = { ...editedMission, crewInfo };
                setEditedMission(updated);
                updateMission(editedMission.id, updated);
              }}
              missionPax={mission.pax}
              missionCargo={mission.cargo}
              missionDateRange={mission.dateRange}
            />
          </CardContent>
        </Card>

        {/* Mission Photos */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Mission Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <MissionPhotoUpload
              missionId={mission.id}
              photos={editedMission.photos || []}
              onPhotosUpdate={handlePhotosUpdate}
            />
          </CardContent>
        </Card>

        {/* Mission Notes */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Mission Notes</CardTitle>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Notes
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editedMission.notes || ''}
                  onChange={(e) => setEditedMission({...editedMission, notes: e.target.value})}
                  placeholder="Add mission notes, observations, or important details..."
                  className="w-full min-h-[120px] bg-slate-700 border border-slate-600 rounded-md p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveMission}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Notes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-slate-300 whitespace-pre-wrap min-h-[60px]">
                  {mission.notes || 'No mission notes added yet. Click "Edit Notes" to add important details, observations, or mission-specific information.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}