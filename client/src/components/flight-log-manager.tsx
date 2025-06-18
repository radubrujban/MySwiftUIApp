import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Clock, MapPin, Plane, X, Calculator, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import IcaoAutocomplete from "@/components/icao-autocomplete";

async function calculateDistance(fromIcao: string, toIcao: string): Promise<number | null> {
  try {
    const response = await fetch(`/api/distance?from=${fromIcao}&to=${toIcao}`);
    if (response.ok) {
      const data = await response.json();
      return data.distance;
    }
  } catch (error) {
    console.error('Error calculating distance:', error);
  }
  return null;
}
interface FlightLeg {
  id: string;
  legNumber: number;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  flightHours: number;
  distanceNm?: number;
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

interface FlightLogManagerProps {
  missionId: number;
  flightLegs: FlightLeg[];
  onFlightLegsUpdate: (flightLegs: FlightLeg[]) => void;
  crewInfo?: CrewInfo;
  onCrewInfoUpdate?: (crewInfo: CrewInfo) => void;
  missionPax?: number;
  missionCargo?: number;
  missionDateRange?: string;
}

export default function FlightLogManager({ 
  missionId, 
  flightLegs, 
  onFlightLegsUpdate, 
  crewInfo, 
  onCrewInfoUpdate, 
  missionPax, 
  missionCargo, 
  missionDateRange 
}: FlightLogManagerProps) {
  const [isAddingLeg, setIsAddingLeg] = useState(false);
  const [newLeg, setNewLeg] = useState<Partial<FlightLeg>>({
    departure: '',
    arrival: '',
    departureTime: '',
    arrivalTime: '',
    flightHours: 0,
    distanceNm: 0,
    tailNumber: '',
    remarks: '',
    pax: 0,
    cargo: 0
  });
  
  const defaultCrewInfo: CrewInfo = {
    fccMembers: [],
    maintenancePersonnel: [],
    aircraftCommander: {
      name: '',
      rank: '',
      flyingSquadron: ''
    }
  };
  
  const { toast } = useToast();

  // Calculate distances for existing flight legs
  const updateExistingLegDistances = async () => {
    const updatedLegs = await Promise.all(
      flightLegs.map(async (leg) => {
        if (!leg.distanceNm && leg.departure && leg.arrival) {
          const distance = await calculateDistance(leg.departure, leg.arrival);
          return { ...leg, distanceNm: distance || 0 };
        }
        return leg;
      })
    );
    
    // Only update if distances were calculated
    const hasNewDistances = updatedLegs.some((leg, index) => 
      leg.distanceNm !== flightLegs[index].distanceNm
    );
    
    if (hasNewDistances) {
      onFlightLegsUpdate(updatedLegs);
      toast({
        title: "Distances Updated",
        description: "Calculated distances for existing flight legs",
      });
    }
  };

  // Auto-calculate distances for existing legs on component mount
  useEffect(() => {
    if (flightLegs.length > 0) {
      const legsWithoutDistances = flightLegs.filter(leg => 
        !leg.distanceNm && leg.departure && leg.arrival
      );
      if (legsWithoutDistances.length > 0) {
        updateExistingLegDistances();
      }
    }
  }, [flightLegs.length]);

  const convertTo24Hour = (time12: string): string => {
    if (!time12) return '';
    
    const timeMatch = time12.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) return time12; // Return as-is if not in expected format
    
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2];
    const period = timeMatch[3].toUpperCase();
    
    if (period === 'AM' && hours === 12) {
      hours = 0;
    } else if (period === 'PM' && hours !== 12) {
      hours += 12;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const calculateFlightHours = (depTime: string, arrTime: string): number => {
    if (!depTime || !arrTime) return 0;
    
    // Convert times to 24-hour format
    const dep24 = convertTo24Hour(depTime);
    const arr24 = convertTo24Hour(arrTime);
    
    if (!dep24 || !arr24) return 0;
    
    const depDate = new Date(`2000-01-01T${dep24}:00`);
    const arrDate = new Date(`2000-01-01T${arr24}:00`);
    
    let diff = arrDate.getTime() - depDate.getTime();
    if (diff < 0) {
      // Handle cross-midnight flights
      diff += 24 * 60 * 60 * 1000;
    }
    
    return diff / (1000 * 60 * 60); // Convert to hours
  };

  const calculateDistance = async (departure: string, arrival: string): Promise<number | null> => {
    if (!departure || !arrival || departure.length !== 4 || arrival.length !== 4) {
      return null;
    }

    try {
      const response = await fetch('/api/airports/distance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ departure, arrival }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.distanceNm;
      }
    } catch (error) {
      console.error('Distance calculation failed:', error);
    }
    
    return null;
  };

  const handleAddLeg = async () => {
    if (!newLeg.departure || !newLeg.arrival || !newLeg.departureTime || !newLeg.arrivalTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for the flight leg.",
        variant: "destructive",
      });
      return;
    }

    const calculatedHours = calculateFlightHours(newLeg.departureTime!, newLeg.arrivalTime!);
    
    try {
      // Create flight leg via API
      const response = await fetch(`/api/missions/${missionId}/legs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departureIcao: newLeg.departure,
          arrivalIcao: newLeg.arrival,
          departureTime: newLeg.departureTime,
          arrivalTime: newLeg.arrivalTime,
          flightHours: calculatedHours,
          distanceNm: newLeg.distanceNm || 0,
          tailNumber: newLeg.tailNumber || '',
          specialHandling: newLeg.remarks || '',
          pax: newLeg.pax || 0,
          cargoWeight: newLeg.cargo || 0
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create flight leg');
      }

      const savedLeg = await response.json();
      
      // Convert API response to frontend format
      const leg: FlightLeg = {
        id: savedLeg.id.toString(),
        legNumber: flightLegs.length + 1,
        departure: savedLeg.departureIcao,
        arrival: savedLeg.arrivalIcao,
        departureTime: savedLeg.departureTime,
        arrivalTime: savedLeg.arrivalTime,
        flightHours: savedLeg.flightHours,
        distanceNm: savedLeg.distanceNm || 0,
        tailNumber: savedLeg.tailNumber || '',
        remarks: savedLeg.specialHandling || '',
        pax: savedLeg.pax || 0,
        cargo: savedLeg.cargoWeight || 0
      };

      const updatedLegs = [...flightLegs, leg];
      onFlightLegsUpdate(updatedLegs);
      
      // Refresh mission data to update statistics
      window.dispatchEvent(new CustomEvent('mission-updated'));
      
      setNewLeg({
        departure: '',
        arrival: '',
        departureTime: '',
        arrivalTime: '',
        flightHours: 0,
        distanceNm: 0,
        tailNumber: '',
        remarks: '',
        pax: 0,
        cargo: 0
      });
      setIsAddingLeg(false);
      
      toast({
        title: "Flight Leg Added",
        description: `Leg ${leg.legNumber}: ${leg.departure} to ${leg.arrival} (${calculatedHours.toFixed(1)} hrs)`,
      });
    } catch (error) {
      console.error('Error creating flight leg:', error);
      toast({
        title: "Error",
        description: "Failed to create flight leg. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveLeg = async (legId: string) => {
    try {
      const response = await fetch(`/api/missions/${missionId}/legs/${legId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete flight leg');
      }

      const updatedLegs = flightLegs.filter(leg => leg.id !== legId)
        .map((leg, index) => ({ ...leg, legNumber: index + 1 }));
      onFlightLegsUpdate(updatedLegs);
      
      // Refresh mission data to update statistics
      window.dispatchEvent(new CustomEvent('mission-updated'));
      
      toast({
        title: "Flight Leg Removed",
        description: "Flight leg has been deleted from the mission.",
      });
    } catch (error) {
      console.error('Error deleting flight leg:', error);
      toast({
        title: "Error",
        description: "Failed to delete flight leg. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentCrewInfo = crewInfo || defaultCrewInfo;

  const addFCCMember = () => {
    const newMember: FCCMember = {
      id: Date.now().toString(),
      name: '',
      rank: '',
      employeeNumber: '',
      sdap: false,
      megp: false,
      departureDate: '',
      returnDate: '',
      distinguishedVisitors: ''
    };
    if (onCrewInfoUpdate) {
      onCrewInfoUpdate({
        ...currentCrewInfo,
        fccMembers: [...currentCrewInfo.fccMembers, newMember]
      });
    }
  };

  const updateFCCMember = (index: number, field: keyof FCCMember, value: string | boolean) => {
    if (onCrewInfoUpdate) {
      const updatedMembers = [...currentCrewInfo.fccMembers];
      updatedMembers[index] = { ...updatedMembers[index], [field]: value };
      onCrewInfoUpdate({
        ...currentCrewInfo,
        fccMembers: updatedMembers
      });
    }
  };

  const removeFCCMember = (index: number) => {
    if (onCrewInfoUpdate) {
      const updatedMembers = currentCrewInfo.fccMembers.filter((_: FCCMember, i: number) => i !== index);
      onCrewInfoUpdate({
        ...currentCrewInfo,
        fccMembers: updatedMembers
      });
    }
  };

  const addMaintenancePersonnel = () => {
    const newPersonnel: MaintenancePersonnel = {
      id: Date.now().toString(),
      name: '',
      rank: '',
      employeeNumber: '',
      sdap: false,
      megp: false,
      departureDate: '',
      returnDate: '',
      fccMonitor: ''
    };
    if (onCrewInfoUpdate) {
      onCrewInfoUpdate({
        ...currentCrewInfo,
        maintenancePersonnel: [...currentCrewInfo.maintenancePersonnel, newPersonnel]
      });
    }
  };

  const updateMaintenancePersonnel = (index: number, field: keyof MaintenancePersonnel, value: string | boolean) => {
    if (onCrewInfoUpdate) {
      const updatedPersonnel = [...currentCrewInfo.maintenancePersonnel];
      updatedPersonnel[index] = { ...updatedPersonnel[index], [field]: value };
      onCrewInfoUpdate({
        ...currentCrewInfo,
        maintenancePersonnel: updatedPersonnel
      });
    }
  };

  const removeMaintenancePersonnel = (index: number) => {
    if (onCrewInfoUpdate) {
      const updatedPersonnel = currentCrewInfo.maintenancePersonnel.filter((_: MaintenancePersonnel, i: number) => i !== index);
      onCrewInfoUpdate({
        ...currentCrewInfo,
        maintenancePersonnel: updatedPersonnel
      });
    }
  };

  const updateAircraftCommander = (field: keyof AircraftCommander, value: string) => {
    if (onCrewInfoUpdate) {
      onCrewInfoUpdate({
        ...currentCrewInfo,
        aircraftCommander: {
          ...currentCrewInfo.aircraftCommander,
          [field]: value
        }
      });
    }
  };

  const handleSaveAll = () => {
    // This will save flight legs and crew info via the parent component
    if (onFlightLegsUpdate) {
      onFlightLegsUpdate(flightLegs);
    }
    if (onCrewInfoUpdate) {
      onCrewInfoUpdate(currentCrewInfo);
    }
    
    toast({
      title: "Saved Successfully",
      description: "All flight log and crew information has been saved.",
    });
  };

  // Enhanced time parsing to handle various formats and add AM/PM
  const parseTimeInput = (input: string): string => {
    if (!input) return '';
    
    // Remove any spaces and convert to uppercase
    let time = input.replace(/\s/g, '').toUpperCase();
    
    // If already has AM/PM, return as is
    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }
    
    // Extract just the numbers and colons
    const timeMatch = time.match(/^(\d{1,2}):?(\d{2})?$/);
    if (!timeMatch) return input;
    
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] || '00';
    
    // Auto-complete AM/PM based on military time logic
    if (hours === 0) {
      return `12:${minutes} AM`;
    } else if (hours < 12) {
      return `${hours}:${minutes} AM`;
    } else if (hours === 12) {
      return `12:${minutes} PM`;
    } else {
      return `${hours - 12}:${minutes} PM`;
    }
  };

  const totalFlightHours = flightLegs.reduce((acc, leg) => acc + leg.flightHours, 0);
  
  // Calculate mission totals
  const calculateMissionTotals = () => {
    // Calculate TDY days from date range
    let tdyDays = 1;
    if (missionDateRange) {
      const dates = missionDateRange.split(' - ');
      if (dates.length === 2) {
        const startDate = new Date(dates[0]);
        const endDate = new Date(dates[1]);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        tdyDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    
    return { 
      totalFlightHours: totalFlightHours,
      tdyDays: tdyDays, 
      totalPax: missionPax || 0, 
      totalCargo: missionCargo || 0 
    };
  };

  const missionTotals = calculateMissionTotals();

  return (
    <div className="space-y-6">
      {/* Flying Crew Chief Mission Report */}
      <Card className="bg-slate-700/30 border-slate-600">
        <CardContent className="p-4">
          <h4 className="text-white font-medium mb-4 text-center">FLYING CREW CHIEF MISSION REPORT</h4>
          
          {/* FCC Members Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-white font-medium text-sm">FCC NAME (LAST, FIRST, MI)</h5>
              <Button
                onClick={addFCCMember}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add FCC
              </Button>
            </div>
            
            {/* FCC Header Row */}
            <div className="grid grid-cols-9 gap-3 text-xs font-medium text-slate-300 bg-slate-800/50 p-3 rounded-t border border-slate-600">
              <div>Name</div>
              <div>Rank</div>
              <div>Employee #</div>
              <div>SDAP</div>
              <div>MEGP</div>
              <div>Departure Date/Time Z</div>
              <div>Return Date/Time Z</div>
              <div>Distinguished Visitors</div>
              <div>Action</div>
            </div>
            
            {/* FCC Members */}
            {currentCrewInfo.fccMembers.map((member: FCCMember, index: number) => (
              <div key={member.id} className="grid grid-cols-9 gap-3 p-3 border-l border-r border-b border-slate-600 bg-slate-800/20">
                <Input
                  value={member.name}
                  onChange={(e) => updateFCCMember(index, 'name', e.target.value)}
                  placeholder="Last, First, MI"
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <Input
                  value={member.rank}
                  onChange={(e) => updateFCCMember(index, 'rank', e.target.value)}
                  placeholder="Rank"
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <Input
                  value={member.employeeNumber}
                  onChange={(e) => updateFCCMember(index, 'employeeNumber', e.target.value)}
                  placeholder="Employee #"
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={member.sdap}
                    onCheckedChange={(checked) => updateFCCMember(index, 'sdap', !!checked)}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={member.megp}
                    onCheckedChange={(checked) => updateFCCMember(index, 'megp', !!checked)}
                  />
                </div>
                <Input
                  type="datetime-local"
                  value={member.departureDate}
                  onChange={(e) => {
                    const datetime = e.target.value;
                    if (datetime) {
                      // Convert to military format: DD MMM YY/HHMM Z
                      const date = new Date(datetime);
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                      const year = date.getFullYear().toString().slice(-2);
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date.getMinutes().toString().padStart(2, '0');
                      const formatted = `${day} ${month} ${year}/${hours}${minutes} Z`;
                      updateFCCMember(index, 'departureDate', formatted);
                    } else {
                      updateFCCMember(index, 'departureDate', '');
                    }
                  }}
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <Input
                  type="datetime-local"
                  value={member.returnDate}
                  onChange={(e) => {
                    const datetime = e.target.value;
                    if (datetime) {
                      // Convert to military format: DD MMM YY/HHMM Z
                      const date = new Date(datetime);
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                      const year = date.getFullYear().toString().slice(-2);
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date.getMinutes().toString().padStart(2, '0');
                      const formatted = `${day} ${month} ${year}/${hours}${minutes} Z`;
                      updateFCCMember(index, 'returnDate', formatted);
                    } else {
                      updateFCCMember(index, 'returnDate', '');
                    }
                  }}
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <Input
                  value={member.distinguishedVisitors}
                  onChange={(e) => updateFCCMember(index, 'distinguishedVisitors', e.target.value)}
                  placeholder="Distinguished Visitors"
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <Button
                  onClick={() => removeFCCMember(index)}
                  variant="destructive"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Other Maintenance Personnel Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-white font-medium text-sm">OTHER MAINTENANCE PERSONNEL</h5>
              <Button
                onClick={addMaintenancePersonnel}
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Personnel
              </Button>
            </div>
            
            {/* Maintenance Header Row */}
            <div className="grid grid-cols-9 gap-3 text-xs font-medium text-slate-300 bg-slate-800/50 p-3 rounded-t border border-slate-600">
              <div>Name</div>
              <div>Rank</div>
              <div>Employee #</div>
              <div>SDAP</div>
              <div>MEGP</div>
              <div>Departure Date/Time Z</div>
              <div>Return Date/Time Z</div>
              <div>FCC Monitor</div>
              <div>Action</div>
            </div>
            
            {/* Maintenance Personnel */}
            {currentCrewInfo.maintenancePersonnel.map((personnel: MaintenancePersonnel, index: number) => (
              <div key={personnel.id} className="grid grid-cols-9 gap-3 p-3 border-l border-r border-b border-slate-600 bg-slate-800/20">
                <Input
                  value={personnel.name}
                  onChange={(e) => updateMaintenancePersonnel(index, 'name', e.target.value)}
                  placeholder="Last, First, MI"
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <Input
                  value={personnel.rank}
                  onChange={(e) => updateMaintenancePersonnel(index, 'rank', e.target.value)}
                  placeholder="Rank"
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <Input
                  value={personnel.employeeNumber}
                  onChange={(e) => updateMaintenancePersonnel(index, 'employeeNumber', e.target.value)}
                  placeholder="Employee #"
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={personnel.sdap}
                    onCheckedChange={(checked) => updateMaintenancePersonnel(index, 'sdap', !!checked)}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={personnel.megp}
                    onCheckedChange={(checked) => updateMaintenancePersonnel(index, 'megp', !!checked)}
                  />
                </div>
                <Input
                  type="datetime-local"
                  value={personnel.departureDate}
                  onChange={(e) => {
                    const datetime = e.target.value;
                    if (datetime) {
                      // Convert to military format: DD MMM YY/HHMM Z
                      const date = new Date(datetime);
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                      const year = date.getFullYear().toString().slice(-2);
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date.getMinutes().toString().padStart(2, '0');
                      const formatted = `${day} ${month} ${year}/${hours}${minutes} Z`;
                      updateMaintenancePersonnel(index, 'departureDate', formatted);
                    } else {
                      updateMaintenancePersonnel(index, 'departureDate', '');
                    }
                  }}
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <Input
                  type="datetime-local"
                  value={personnel.returnDate}
                  onChange={(e) => {
                    const datetime = e.target.value;
                    if (datetime) {
                      // Convert to military format: DD MMM YY/HHMM Z
                      const date = new Date(datetime);
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                      const year = date.getFullYear().toString().slice(-2);
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date.getMinutes().toString().padStart(2, '0');
                      const formatted = `${day} ${month} ${year}/${hours}${minutes} Z`;
                      updateMaintenancePersonnel(index, 'returnDate', formatted);
                    } else {
                      updateMaintenancePersonnel(index, 'returnDate', '');
                    }
                  }}
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <Input
                  value={personnel.fccMonitor}
                  onChange={(e) => updateMaintenancePersonnel(index, 'fccMonitor', e.target.value)}
                  placeholder="FCC Monitor"
                  className="bg-slate-800 border-slate-600 text-white h-9 text-sm min-w-0"
                />
                <Button
                  onClick={() => removeMaintenancePersonnel(index)}
                  variant="destructive"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Aircraft Commander Section */}
          <div className="mb-4">
            <h5 className="text-white font-medium text-sm mb-3">AIRCRAFT COMMANDER</h5>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-300 text-xs">Name (Last, First, MI)</Label>
                <Input
                  value={currentCrewInfo.aircraftCommander.name}
                  onChange={(e) => updateAircraftCommander('name', e.target.value)}
                  placeholder="Last, First, MI"
                  className="bg-slate-800 border-slate-600 text-white h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300 text-xs">Rank</Label>
                <Input
                  value={currentCrewInfo.aircraftCommander.rank}
                  onChange={(e) => updateAircraftCommander('rank', e.target.value)}
                  placeholder="Rank"
                  className="bg-slate-800 border-slate-600 text-white h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300 text-xs">Flying Squadron Supporting</Label>
                <Input
                  value={currentCrewInfo.aircraftCommander.flyingSquadron}
                  onChange={(e) => updateAircraftCommander('flyingSquadron', e.target.value)}
                  placeholder="Squadron"
                  className="bg-slate-800 border-slate-600 text-white h-8 text-xs mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Save All Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSaveAll}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium"
          size="lg"
        >
          <Save className="h-5 w-5 mr-2" />
          Save All Information
        </Button>
      </div>

      {/* Flight Legs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium">Flight Legs</h4>
          <div className="flex gap-2">
            <Button
              onClick={updateExistingLegDistances}
              size="sm"
              variant="outline"
              className="border-cyan-600 text-cyan-400 hover:bg-cyan-600/10"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Recalculate Distances
            </Button>
            <Button
              onClick={() => setIsAddingLeg(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Leg
            </Button>
          </div>
        </div>

        {flightLegs.length === 0 && !isAddingLeg ? (
          <div className="text-center py-8 text-slate-400">
            <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No flight legs recorded</p>
            <p className="text-xs mt-1">Add flight legs to track hours and routes</p>
          </div>
        ) : (
          <>
            {/* Header Row */}
            <div className="grid grid-cols-11 gap-2 text-xs font-medium text-slate-300 px-3 py-2 bg-slate-700/50 rounded">
              <div>Leg</div>
              <div>From</div>
              <div>To</div>
              <div>Dep Time</div>
              <div>Arr Time</div>
              <div>Hours</div>
              <div>Distance (NM)</div>
              <div>PAX</div>
              <div>Cargo (lbs)</div>
              <div>Tail #</div>
              <div>Actions</div>
            </div>

            {/* Flight Legs */}
            {flightLegs.map((leg) => (
              <Card key={leg.id} className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-3">
                  <div className="grid grid-cols-11 gap-2 text-sm items-center">
                    <div className="font-medium text-white">{leg.legNumber}</div>
                    <div className="text-slate-300">{leg.departure}</div>
                    <div className="text-slate-300">{leg.arrival}</div>
                    <div className="text-slate-300">{leg.departureTime}</div>
                    <div className="text-slate-300">{leg.arrivalTime}</div>
                    <div className="font-medium text-blue-400">{leg.flightHours.toFixed(1)}</div>
                    <div className="font-medium text-cyan-400">{(leg.distanceNm || 0).toFixed(1)}</div>
                    <div className="text-green-400">{(leg as any).pax || 0}</div>
                    <div className="text-orange-400">{((leg as any).cargo || 0).toLocaleString()}</div>
                    <div className="text-slate-300">{leg.tailNumber || 'N/A'}</div>
                    <div>
                      <Button
                        onClick={() => handleRemoveLeg(leg.id)}
                        variant="destructive"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {leg.remarks && (
                    <div className="mt-2 text-xs text-slate-400">
                      <strong>Remarks:</strong> {leg.remarks}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* Add New Leg Form */}
        {isAddingLeg && (
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <h5 className="text-white font-medium mb-3">Add New Flight Leg</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">From (ICAO)</Label>
                  <div className="mt-1">
                    <IcaoAutocomplete
                      value={newLeg.departure || ""}
                      onChange={async (value: string) => {
                        setNewLeg({ ...newLeg, departure: value });
                        if (value && newLeg.arrival && value.length === 4 && newLeg.arrival.length === 4) {
                          const distance = await calculateDistance(value, newLeg.arrival);
                          if (distance) {
                            setNewLeg(prev => ({ ...prev, distanceNm: distance }));
                          }
                        }
                      }}
                      placeholder="Enter departure ICAO"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">To (ICAO)</Label>
                  <div className="mt-1">
                    <IcaoAutocomplete
                      value={newLeg.arrival || ""}
                      onChange={async (value: string) => {
                        setNewLeg({ ...newLeg, arrival: value });
                        if (value && newLeg.departure && value.length === 4 && newLeg.departure.length === 4) {
                          const distance = await calculateDistance(newLeg.departure, value);
                          if (distance) {
                            setNewLeg(prev => ({ ...prev, distanceNm: distance }));
                          }
                        }
                      }}
                      placeholder="Enter arrival ICAO"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">Departure Time</Label>
                  <Input
                    type="time"
                    value={newLeg.departureTime ? convertTo24Hour(newLeg.departureTime) : ''}
                    onChange={(e) => {
                      const time24 = e.target.value;
                      if (time24) {
                        // Convert 24-hour to 12-hour with AM/PM
                        const [hours, minutes] = time24.split(':');
                        const hour24 = parseInt(hours);
                        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                        const period = hour24 < 12 ? 'AM' : 'PM';
                        const formattedTime = `${hour12}:${minutes} ${period}`;
                        setNewLeg({ ...newLeg, departureTime: formattedTime });
                      } else {
                        setNewLeg({ ...newLeg, departureTime: '' });
                      }
                    }}
                    className="bg-slate-800 border-slate-600 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Arrival Time</Label>
                  <Input
                    type="time"
                    value={newLeg.arrivalTime ? convertTo24Hour(newLeg.arrivalTime) : ''}
                    onChange={(e) => {
                      const time24 = e.target.value;
                      if (time24) {
                        // Convert 24-hour to 12-hour with AM/PM
                        const [hours, minutes] = time24.split(':');
                        const hour24 = parseInt(hours);
                        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                        const period = hour24 < 12 ? 'AM' : 'PM';
                        const formattedTime = `${hour12}:${minutes} ${period}`;
                        setNewLeg({ ...newLeg, arrivalTime: formattedTime });
                      } else {
                        setNewLeg({ ...newLeg, arrivalTime: '' });
                      }
                    }}
                    className="bg-slate-800 border-slate-600 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Tail Number</Label>
                  <Input
                    value={newLeg.tailNumber}
                    onChange={(e) => setNewLeg({ ...newLeg, tailNumber: e.target.value.toUpperCase() })}
                    placeholder="12-3456"
                    className="bg-slate-800 border-slate-600 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">PAX</Label>
                  <Input
                    type="number"
                    value={newLeg.pax === 0 ? '' : newLeg.pax || ''}
                    onChange={(e) => setNewLeg({ ...newLeg, pax: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="bg-slate-800 border-slate-600 text-white mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Cargo (lbs)</Label>
                  <Input
                    type="number"
                    value={newLeg.cargo === 0 ? '' : newLeg.cargo || ''}
                    onChange={(e) => setNewLeg({ ...newLeg, cargo: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="bg-slate-800 border-slate-600 text-white mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Flight Hours</Label>
                  <div className="text-blue-400 font-medium mt-2 text-sm">
                    {newLeg.departureTime && newLeg.arrivalTime ? 
                      `${calculateFlightHours(newLeg.departureTime, newLeg.arrivalTime).toFixed(1)} hrs` : 
                      'Auto-calculated'
                    }
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">Distance (NM)</Label>
                  <div className="text-cyan-400 font-medium mt-2 text-sm">
                    {newLeg.distanceNm ? 
                      `${newLeg.distanceNm.toFixed(1)} NM` : 
                      'Auto-calculated'
                    }
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-slate-300">Remarks</Label>
                <Input
                  value={newLeg.remarks}
                  onChange={(e) => setNewLeg({ ...newLeg, remarks: e.target.value })}
                  placeholder="Optional remarks or notes"
                  className="bg-slate-800 border-slate-600 text-white mt-1"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleAddLeg}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save Leg
                </Button>
                <Button
                  onClick={() => setIsAddingLeg(false)}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}