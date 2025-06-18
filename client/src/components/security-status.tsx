import { useState, useEffect } from 'react';
import { securityManager } from '@/lib/security';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Eye, RefreshCw } from 'lucide-react';

export default function SecurityStatus() {
  const [securityStatus, setSecurityStatus] = useState(securityManager.getSecurityStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityStatus(securityManager.getSecurityStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-900/30 text-green-400 border-green-700';
      case 'medium': return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'low': return 'bg-red-900/30 text-red-400 border-red-700';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-700';
    }
  };

  return (
    <Card className="ios-card aviation-surface border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-blue-400" />
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-300 text-sm">Security Level:</span>
          <Badge className={getSecurityLevelColor(securityStatus.securityLevel)}>
            {securityStatus.securityLevel.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Session:</span>
            {securityStatus.sessionValid ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-400" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Encryption:</span>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Biometric:</span>
            {securityStatus.biometricSupported ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Monitoring:</span>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </div>
        </div>

        {securityStatus.lastActivity && (
          <div className="text-xs text-gray-500 mt-3">
            Last Activity: {securityStatus.lastActivity.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}