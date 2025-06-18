import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Palette, 
  Database, 
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Smartphone,
  Lock,
  Clock,
  Eye,
  ArrowLeft,
  HelpCircle,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoSave: boolean;
  encryptionLevel: string;
  biometricAuth: boolean;
  sessionTimeout: number;
}

export default function Settings() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showHelp, setShowHelp] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    language: 'en',
    autoSave: true,
    encryptionLevel: 'military',
    biometricAuth: false,
    sessionTimeout: 30
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('cata1-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Apply theme on load
    applyTheme(settings.theme);
  }, []);

  // Apply theme changes
  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('cata1-settings', JSON.stringify(newSettings));
    
    // Apply theme changes immediately
    if (key === 'theme') {
      applyTheme(value);
    }

    toast({
      title: "Setting Updated",
      description: "Your preference has been saved.",
    });
  };

  const handleResetAllData = async () => {
    try {
      // Clear all mission data from API
      await fetch('/api/missions/reset', { method: 'DELETE' });
      
      // Clear localStorage
      localStorage.removeItem('mission-data');
      localStorage.removeItem('user-stats');
      localStorage.removeItem('scan-history');
      localStorage.removeItem('cata1-learning');
      
      // Reset settings to defaults
      const defaultSettings: AppSettings = {
        theme: 'system',
        language: 'en',
        autoSave: true,
        encryptionLevel: 'military',
        biometricAuth: false,
        sessionTimeout: 30
      };
      
      setSettings(defaultSettings);
      localStorage.setItem('cata1-settings', JSON.stringify(defaultSettings));
      applyTheme('system');

      toast({
        title: "Complete Reset Successful",
        description: "All mission data, statistics, and settings have been reset.",
      });

      // Reload page to ensure clean state
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "There was an error resetting your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBackupData = async () => {
    try {
      const response = await fetch('/api/missions');
      const missions = await response.json();
      
      const backup = {
        missions: missions,
        settings: settings,
        exportDate: new Date().toISOString(),
        version: "2.0",
        appType: "Cata1Scanner"
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cata1-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Created",
        description: "Your mission data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "There was an error creating your backup.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* iPhone-optimized header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation('/')}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="text-xs h-8"
            >
              <HelpCircle className="h-3 w-3 mr-1" />
              Help
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBackupData}
              className="text-xs h-8"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-20">
        {/* Help Section */}
        {showHelp && (
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-blue-700 dark:text-blue-300">
                <BookOpen className="h-4 w-4" />
                Mission Tracker Help Guide
              </CardTitle>
              <CardDescription className="text-sm text-blue-600 dark:text-blue-400">
                Understanding mission statuses and key features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {/* Mission Status Explanations */}
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Mission Status Types</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 min-w-fit">Planning</Badge>
                    <span className="text-xs text-muted-foreground">Mission is being planned, routes not finalized</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 min-w-fit">In Progress</Badge>
                    <span className="text-xs text-muted-foreground">Mission is currently executing, legs may be added</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 min-w-fit">Deployment</Badge>
                    <span className="text-xs text-muted-foreground">Extended mission with multiple phases</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 min-w-fit">Completed</Badge>
                    <span className="text-xs text-muted-foreground">Mission finished, all legs logged</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Key Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Key Features Explained</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-xs">Flight Leg Management</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Each flight leg represents one segment of your mission. Add departure/arrival times, 
                      passenger count, cargo weight, and the system automatically calculates flight hours and distances.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-xs">Auto-Save & Encryption</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      All mission data is automatically encrypted using military-grade AES-256 encryption. 
                      Your data is saved locally and securely as you type.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-xs">ICAO Airport Search</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Type any airport code or name. The system searches C-17 compatible airports with 
                      runways longer than 3,500 feet and calculates real distances.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-xs">Flight Statistics</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your dashboard tracks total flight hours, distance flown, cargo moved, passengers transported, 
                      and provides mission completion analytics.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-xs">Document Scanner (Cata1)</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Scan AMC IMI 170 forms and mission documents. The AI extracts flight data automatically 
                      and populates your mission logs for faster data entry.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tips & Tricks */}
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Tips & Tricks</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• Use the mission search to quickly find specific missions by number or destination</p>
                  <p>• Change mission status to "Completed" when all legs are finalized</p>
                  <p>• Export your data regularly to create mission reports and backups</p>
                  <p>• The totalizer shows combined statistics across all your missions</p>
                  <p>• Flight hours are calculated automatically based on departure/arrival times</p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowHelp(false)}
                  className="w-full"
                >
                  Close Help
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Theme & Appearance */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />
              Theme & Appearance
            </CardTitle>
            <CardDescription className="text-sm">
              Customize the visual appearance of your app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-sm font-medium">Theme Preference</Label>
              <Select 
                value={settings.theme} 
                onValueChange={(value) => updateSetting('theme', value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">Language</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => updateSetting('language', value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Security & Privacy
              <Badge variant="outline" className="text-xs">
                Military Grade
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              Manage security settings for sensitive mission data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="encryption" className="text-sm font-medium">Data Encryption Level</Label>
              <Select 
                value={settings.encryptionLevel} 
                onValueChange={(value) => updateSetting('encryptionLevel', value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select encryption level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (AES-256)</SelectItem>
                  <SelectItem value="military">Military Grade (AES-256 + FIPS 140-2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-timeout" className="text-sm font-medium">Session Timeout</Label>
              <Select 
                value={settings.sessionTimeout.toString()} 
                onValueChange={(value) => updateSetting('sessionTimeout', parseInt(value))}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="0">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save" className="text-sm font-medium">Auto-save Mission Data</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically save and encrypt during editing
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={settings.autoSave}
                onCheckedChange={(value) => updateSetting('autoSave', value)}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="biometric" className="text-sm font-medium">Biometric Authentication</Label>
                <p className="text-xs text-muted-foreground">
                  Use Face ID or Touch ID for app access
                </p>
              </div>
              <Switch
                id="biometric"
                checked={settings.biometricAuth}
                onCheckedChange={(value) => updateSetting('biometricAuth', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4" />
              Data Management
            </CardTitle>
            <CardDescription className="text-sm">
              Backup, restore, and manage your mission data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-11" 
                onClick={handleBackupData}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="h-11">
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <Label className="text-destructive font-semibold text-sm">Danger Zone</Label>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full h-11">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Complete Mission Log Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="mx-4 max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm space-y-2">
                      <p>This action cannot be undone. This will permanently delete:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>All mission records and flight legs</li>
                        <li>All flight statistics and achievements</li>
                        <li>All Cata1 scanner learning data</li>
                        <li>All application settings and preferences</li>
                      </ul>
                      <p className="font-semibold text-destructive text-sm">
                        This will reset the entire application to factory defaults.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="h-11">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetAllData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-11"
                    >
                      Yes, Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <p className="text-xs text-muted-foreground">
                Creates a complete fresh start with no recoverable data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}