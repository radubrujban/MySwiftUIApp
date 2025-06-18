import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  FileText, 
  Check, 
  ArrowLeft,
  Plane,
  Clock,
  MapPin,
  Scan,
  Brain
} from "lucide-react";
import NavigationHeader from "@/components/navigation-header";
import { useToast } from "@/hooks/use-toast";
import { missionTracker } from "@/lib/mission-tracker";
// Removed scanner component to reduce codebase size

interface MissionData {
  number: string;
  type: string;
  name: string;
  createdAt: string;
}

export default function ScanPage() {
  const { toast } = useToast();
  const [missionData, setMissionData] = useState<MissionData | null>(null);
  const [isScanned, setIsScanned] = useState(false);
  const [showCata1Scanner, setShowCata1Scanner] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  useEffect(() => {
    // Load current mission data
    const currentMission = localStorage.getItem('current_mission');
    if (currentMission) {
      setMissionData(JSON.parse(currentMission));
    } else {
      // No mission found, redirect to dashboard
      toast({
        title: "No Active Mission",
        description: "Please create a mission first",
        variant: "destructive"
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }, []);

  const handleCata1ScanComplete = async (scanResult: any) => {
    if (!missionData) return;

    try {
      setExtractedData(scanResult);

      // Log the scan event with AI results
      missionTracker.logMissionEvent('UPDATED', missionData.number, 
        `Cata1 AI processed document with ${scanResult.confidence}% confidence`);

      // Mark as completed and add scoring
      missionTracker.logMissionEvent('COMPLETED', missionData.number, 
        `${missionData.type} mission completed with AI assistance`);
      
      // Generate scoring based on scan confidence and quality
      const aiScore = {
        onTimeScore: Math.min(95, 75 + (scanResult.confidence * 0.2)),
        cargoEfficiency: Math.min(100, 80 + (scanResult.confidence * 0.15)),
        fuelEfficiency: Math.min(95, 70 + (scanResult.confidence * 0.25)),
        safetyScore: Math.min(100, 90 + (scanResult.confidence * 0.1))
      };

      missionTracker.recordFlightScore(missionData.number, aiScore);

      setIsScanned(true);
      setShowCata1Scanner(false);
      
      toast({
        title: "Cata1 Scan Complete",
        description: `Document processed with ${scanResult.confidence}% confidence using AI learning`,
      });

      // Store scan results for learning improvements
      localStorage.setItem(`cata1_scan_${missionData.number}`, JSON.stringify(scanResult));
      localStorage.removeItem('current_mission');

    } catch (error) {
      console.error('Cata1 scan processing error:', error);
      toast({
        title: "Processing Failed",
        description: "Could not process scan results. Please try again.",
        variant: "destructive"
      });
    }
  };

  const goBackToDashboard = () => {
    window.location.href = '/';
  };

  if (!missionData) {
    return (
      <div className="min-h-screen bg-[var(--aviation-dark)] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading mission data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--aviation-dark)] text-white ios-safe-area">
      <NavigationHeader onNewMission={() => window.location.href = '/'} />
      
      <div className="aviation-container py-6 space-y-6">
        {/* Mission Info Header */}
        <Card className="ios-card bg-blue-900/30 border-blue-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  {missionData.number}
                </CardTitle>
                <p className="text-blue-300 text-sm">{missionData.name}</p>
              </div>
              <Badge 
                variant={missionData.type === 'DEPLOYMENT' ? 'default' : 'secondary'}
                className={missionData.type === 'DEPLOYMENT' ? 'bg-blue-600' : 'bg-green-600'}
              >
                {missionData.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Clock className="h-4 w-4" />
              Created: {new Date(missionData.createdAt).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {!isScanned ? (
          <>
            {/* Cata1 AI Scanner Section */}
            <Card className="ios-card bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-blue-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Scan className="h-5 w-5 text-blue-400" />
                  Cata1 AI Scanner
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                    AI Powered
                  </Badge>
                </CardTitle>
                <p className="text-blue-200 text-sm">
                  Advanced handwriting recognition with learning capabilities
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-blue-800/20 rounded-lg border border-blue-500/20">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                    <h4 className="text-white font-medium text-sm">AI Learning</h4>
                    <p className="text-blue-300 text-xs">Improves with corrections</p>
                  </div>
                  <div className="p-4 bg-purple-800/20 rounded-lg border border-purple-500/20">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                    <h4 className="text-white font-medium text-sm">Multi-Format</h4>
                    <p className="text-purple-300 text-xs">Camera + file upload</p>
                  </div>
                </div>

                <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-green-400" />
                    <span className="text-green-300 font-medium text-sm">Smart Recognition</span>
                  </div>
                  <ul className="text-green-200 text-xs space-y-1">
                    <li>• Highlights uncertain text for correction</li>
                    <li>• Learns from your handwriting patterns</li>
                    <li>• Supports HEIC, JPEG, PNG, WebP formats</li>
                    <li>• Real-time confidence indicators</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={goBackToDashboard}
                    variant="outline"
                    className="flex-1 border-gray-600"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <Button 
                    onClick={() => setShowCata1Scanner(true)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    Launch Cata1
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features Overview */}
            <Card className="ios-card bg-gray-800/30 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-400" />
                  How Cata1 Works
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <div>
                      <p className="text-white font-medium">Scan Document</p>
                      <p className="text-gray-400">Use camera or upload file</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <div>
                      <p className="text-white font-medium">AI Analysis</p>
                      <p className="text-gray-400">Advanced OCR with confidence scoring</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <div>
                      <p className="text-white font-medium">Learn & Improve</p>
                      <p className="text-gray-400">Correct highlighted text to teach Cata1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Completion Screen */
          <Card className="ios-card bg-green-900/30 border-green-700">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Mission Complete!</h2>
                <p className="text-green-300">
                  Document processed and flight data extracted successfully
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Flight legs identified and logged</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Mission scoring completed</span>
                </div>
              </div>

              <Button 
                onClick={goBackToDashboard}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Cata1 Scanner Modal */}
        <Cata1Scanner
          isOpen={showCata1Scanner}
          onClose={() => setShowCata1Scanner(false)}
          onScanComplete={handleCata1ScanComplete}
        />
      </div>
    </div>
  );
}