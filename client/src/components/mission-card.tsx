import { Link } from "wouter";
import { Plane, Users, Package, Route, FileText, Clock, CheckCircle, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MissionWithLegs } from "@shared/schema";

interface MissionCardProps {
  mission: MissionWithLegs;
  onScanDocument: (missionId: number) => void;
  className?: string;
}

export default function MissionCard({ mission, onScanDocument, className = "" }: MissionCardProps) {
  const totalPax = mission.legs.reduce((sum, leg) => sum + (leg.pax || 0), 0);
  const totalCargo = mission.legs.reduce((sum, leg) => sum + (leg.cargoWeight || 0), 0);
  
  const statusColor = mission.status === "Completed" 
    ? "bg-[var(--aviation-success)]" 
    : "bg-[var(--aviation-warning)]";

  const typeColor = mission.type === "TDY" 
    ? "aviation-blue" 
    : "bg-[var(--aviation-warning)]";

  const formatDate = (dateStr: string | Date | null) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`aviation-surface border border-gray-600 rounded-xl overflow-hidden hover:border-[var(--aviation-blue)] transition-colors ios-card ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${typeColor} rounded-lg flex items-center justify-center`}>
              <Plane className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg aviation-text">{mission.name}</h3>
              <p className="aviation-text-muted text-sm">{mission.type} Mission</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`${typeColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
              {mission.type}
            </span>
            <span className={`${statusColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
              {mission.status}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="aviation-text-muted">Date Range:</span>
            <span className="aviation-text">
              {formatDate(mission.startDate)} - {formatDate(mission.endDate)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="aviation-text-muted">Legs:</span>
            <span className="aviation-text">{mission.legs.length} legs</span>
          </div>
          {totalPax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="aviation-text-muted">Total PAX:</span>
              <span className="aviation-text">{totalPax}</span>
            </div>
          )}
          {totalCargo > 0 && (
            <div className="flex justify-between text-sm">
              <span className="aviation-text-muted">Total Cargo:</span>
              <span className="aviation-text">{totalCargo.toLocaleString()} lbs</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-600">
          <div className="flex items-center space-x-4 text-sm aviation-text-muted">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {totalPax} PAX
            </div>
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-1" />
              {(totalCargo / 1000).toFixed(1)}k lbs
            </div>
            <div className="flex items-center">
              <Route className="h-4 w-4 mr-1" />
              {mission.legs.length} legs
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2 text-sm aviation-text-muted">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>Ready for Operations</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={(e) => {
                e.preventDefault();
                onScanDocument(mission.id);
              }}
              size="sm"
              className="bg-[var(--aviation-blue)] hover:bg-blue-600 text-white touch-button ios-button-primary"
            >
              <Scan className="h-4 w-4 mr-2" />
              Scan Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
