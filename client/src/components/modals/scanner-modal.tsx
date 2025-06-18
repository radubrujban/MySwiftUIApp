import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: number | null;
}

export default function ScannerModal({ isOpen, onClose, missionId }: ScannerModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scanMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!missionId) throw new Error("No mission selected");
      
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch(`/api/missions/${missionId}/scan`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to scan document');
      }
      
      return response.json();
    },
    onSuccess: async (data) => {
      const confidence = data.confidence || 0.8;
      const confidencePercent = Math.round(confidence * 100);
      
      toast({
        title: "AMC IMI 170 Processed",
        description: `Extracted ${data.extractedData.legs.length} flight legs with ${confidencePercent}% confidence.`,
      });
      
      // Create flight legs from extracted data
      try {
        for (const legData of data.extractedData.legs) {
          await apiRequest("POST", `/api/missions/${missionId}/legs`, legData);
        }
        
        queryClient.invalidateQueries({ queryKey: [`/api/missions/${missionId}`] });
        queryClient.invalidateQueries({ queryKey: ["/api/missions"] });
        
        const warningMessage = confidence < 0.7 
          ? " Some data may need verification due to document quality."
          : "";
        
        toast({
          title: "Flight Legs Created",
          description: `Successfully created ${data.extractedData.legs.length} flight legs.${warningMessage}`,
          variant: confidence < 0.7 ? "destructive" : "default",
        });
      } catch (error: any) {
        toast({
          title: "Error Creating Legs",
          description: error.message || "Failed to create flight legs.",
          variant: "destructive",
        });
      }
      
      setIsScanning(false);
      setScanProgress(0);
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Scan Failed",
        description: error.message || "Failed to scan document.",
        variant: "destructive",
      });
      setIsScanning(false);
      setScanProgress(0);
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file.type.includes('image') && !file.type.includes('pdf')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image or PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    scanMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="aviation-surface border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="aviation-text">Document Scanner</DialogTitle>
        </DialogHeader>
        
        {/* Warning Alert */}
        <Alert className="bg-[var(--aviation-warning)]/20 border-[var(--aviation-warning)]">
          <AlertTriangle className="h-4 w-4 text-[var(--aviation-warning)]" />
          <AlertDescription className="text-gray-300">
            <span className="font-medium text-[var(--aviation-warning)]">AMC IMI 170 Scanner:</span>{" "}
            This scanner is optimized for AMC IMI 170 forms. The OCR may not correctly interpret illegible handwriting or poor quality scans. Ensure clear, high-contrast documents for best results.
          </AlertDescription>
        </Alert>
        
        {!isScanning ? (
          /* File Upload Area */
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-[var(--aviation-blue)] bg-[var(--aviation-blue)]/10' 
                : 'border-gray-600 hover:border-[var(--aviation-blue)]'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
          >
            <Upload className="h-12 w-12 aviation-text-muted mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2 aviation-text">Upload Document</h4>
            <p className="aviation-text-muted mb-4">Drag and drop your mission document or click to browse</p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="aviation-blue aviation-blue-hover"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          /* Scanner Progress */
          <div className="py-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--aviation-blue)]"></div>
              <span className="text-sm aviation-text">Scanning document...</span>
            </div>
            <Progress value={scanProgress} className="w-full" />
            <p className="text-sm aviation-text-muted mt-2">
              Processing with OCR technology - {Math.round(scanProgress)}% complete
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
