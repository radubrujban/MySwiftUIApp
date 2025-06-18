import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, AlertTriangle, CheckCircle } from "lucide-react";

interface SecurityStatus {
  encryption: {
    configured: boolean;
    documentsEncrypted: number;
    fieldsEncrypted: number;
  };
  audit: {
    totalEvents: number;
    failedEvents: number;
    lastEvent?: string;
    recentFailures: Array<{
      timestamp: string;
      eventType: string;
      details: string;
    }>;
  };
  storage: {
    count: number;
    totalSize: number;
  };
}

export default function SecurityDashboard() {
  const { data: security, isLoading } = useQuery<SecurityStatus>({
    queryKey: ['/api/security/status'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!security) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unable to load security status. Check system configuration.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Military-Grade Security Status
          </CardTitle>
          <CardDescription>
            AES-256 encryption monitoring for AMC IMI 170 documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Encryption System</span>
            <Badge variant={security.encryption.configured ? "default" : "destructive"}>
              {security.encryption.configured ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
              ) : (
                <><AlertTriangle className="h-3 w-3 mr-1" /> Not Configured</>
              )}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Encrypted Documents</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {security.encryption.documentsEncrypted}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Encrypted Fields</span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {security.encryption.fieldsEncrypted}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Events</span>
                <div className="font-semibold">{security.audit.totalEvents}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Failed Events</span>
                <div className="font-semibold text-red-600 dark:text-red-400">
                  {security.audit.failedEvents}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Storage Size</span>
                <div className="font-semibold">
                  {(security.storage.totalSize / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
          </div>

          {security.audit.recentFailures.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Recent Security Events:</div>
                <ul className="space-y-1 text-xs">
                  {security.audit.recentFailures.slice(0, 3).map((failure, index) => (
                    <li key={index} className="truncate">
                      {new Date(failure.timestamp).toLocaleTimeString()}: {failure.details}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}