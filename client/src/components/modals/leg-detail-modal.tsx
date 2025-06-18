import { useState } from "react";
import { X, Edit2, FileDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditLegModal from "./edit-leg-modal";
import EncryptedField from "@/components/encrypted-field";
import type { FlightLeg } from "@shared/schema";

interface LegDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leg: FlightLeg;
}

export default function LegDetailModal({ isOpen, onClose, leg }: LegDetailModalProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const formatTime = (timeStr: string) => {
    // Simple time formatting - in a real app you'd use a proper date library
    return timeStr;
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="aviation-surface border-gray-700 max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <DialogTitle className="aviation-text">Flight Leg Details</DialogTitle>
              <div className="flex items-center space-x-2 text-[var(--aviation-blue)]">
                <span className="text-lg font-bold">{leg.departureIcao}</span>
                <span className="aviation-text-muted">→</span>
                <span className="text-lg font-bold">{leg.arrivalIcao}</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flight Information */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-4 aviation-text">Flight Information</h4>
              <div className="space-y-3">
                <EncryptedField 
                  label="Mission Number" 
                  value={leg.missionNumber} 
                  sensitive={true}
                />
                <EncryptedField 
                  label="Aircraft Type" 
                  value={leg.aircraftType} 
                  sensitive={true}
                />
                <EncryptedField 
                  label="Tail Number" 
                  value={leg.tailNumber} 
                  sensitive={true}
                />
                <EncryptedField 
                  label="Flight Duration" 
                  value={leg.duration} 
                  sensitive={false}
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4 aviation-text">Departure</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="aviation-text-muted">Airport:</span>
                  <span className="font-medium aviation-text">{leg.departureIcao} - {leg.departureName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="aviation-text-muted">Time:</span>
                  <span className="font-medium aviation-text">{formatTime(leg.departureTime)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Load Information */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-4 aviation-text">Arrival</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="aviation-text-muted">Airport:</span>
                  <span className="font-medium aviation-text">{leg.arrivalIcao} - {leg.arrivalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="aviation-text-muted">Time:</span>
                  <span className="font-medium aviation-text">{formatTime(leg.arrivalTime)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4 aviation-text">Load Information</h4>
              <div className="grid grid-cols-1 gap-4">
                <EncryptedField 
                  label="Passengers" 
                  value={`${leg.pax} PAX`} 
                  sensitive={true}
                />
                <EncryptedField 
                  label="Cargo Weight" 
                  value={`${leg.cargoWeight.toLocaleString()} lbs`} 
                  sensitive={true}
                />
                <EncryptedField 
                  label="Cargo Type" 
                  value={leg.cargoType} 
                  sensitive={true}
                />
                <EncryptedField 
                  label="Special Handling" 
                  value={leg.specialHandling} 
                  sensitive={true}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-600">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="aviation-text-muted hover:aviation-text"
          >
            Close
          </Button>
          <Button 
            onClick={handleEditClick}
            variant="outline"
            className="aviation-card border-gray-600 aviation-text hover:bg-gray-700"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
          <Button className="aviation-blue aviation-blue-hover">
            <FileDown className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </DialogContent>
      
      <EditLegModal 
        isOpen={showEditModal} 
        onClose={handleEditClose}
        leg={leg}
      />
    </Dialog>
  );
}
