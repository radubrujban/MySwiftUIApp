import { Plane, ChevronRight } from "lucide-react";
import type { FlightLeg as FlightLegType } from "@shared/schema";

interface FlightLegProps {
  leg: FlightLegType;
  onClick: () => void;
}

export default function FlightLeg({ leg, onClick }: FlightLegProps) {
  const formatTime = (timeStr: string) => {
    // Format time for AMC IMI 170 display (handles local time with zone indicators)
    if (timeStr.includes('+')) {
      const [time, day] = timeStr.split('+');
      return `${time} (+${day})`;
    }
    return timeStr;
  };

  const formatCargoWeight = (weight: number) => {
    // Format cargo weight for military display
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(0)}K lbs`;
    }
    return `${weight} lbs`;
  };

  return (
    <div 
      onClick={onClick}
      className="aviation-card border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-xl font-bold text-[var(--aviation-blue)]">{leg.departureIcao}</div>
            <div className="text-xs aviation-text-muted">{leg.departureName}</div>
          </div>
          <div className="flex items-center space-x-2 aviation-text-muted">
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <Plane className="h-5 w-5 text-[var(--aviation-blue)]" />
            <div className="w-8 h-0.5 bg-gray-600"></div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[var(--aviation-blue)]">{leg.arrivalIcao}</div>
            <div className="text-xs aviation-text-muted">{leg.arrivalName}</div>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-center">
            <div className="aviation-text-muted">Departure</div>
            <div className="font-medium aviation-text">{formatTime(leg.departureTime)}</div>
          </div>
          <div className="text-center">
            <div className="aviation-text-muted">Arrival</div>
            <div className="font-medium aviation-text">{formatTime(leg.arrivalTime)}</div>
          </div>
          <div className="text-center">
            <div className="aviation-text-muted">PAX</div>
            <div className="font-medium aviation-text">{leg.pax}</div>
          </div>
          <div className="text-center">
            <div className="aviation-text-muted">Cargo</div>
            <div className="font-medium aviation-text">{formatCargoWeight(leg.cargoWeight)}</div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 aviation-text-muted" />
      </div>
    </div>
  );
}
