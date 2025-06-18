import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Shield, Lock, Eye, FileText, Users } from "lucide-react";

interface SecurityWarningProps {
  onAccept: () => void;
}

export default function GovernmentSecurityWarning({ onAccept }: SecurityWarningProps) {
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [acknowledgedClassification, setAcknowledgedClassification] = useState(false);
  const [confirmedAuthorization, setConfirmedAuthorization] = useState(false);
  const [understoodPenalties, setUnderstoodPenalties] = useState(false);
  const [acceptedMonitoring, setAcceptedMonitoring] = useState(false);

  const canProceed = 
    agreedToPolicy && 
    acknowledgedClassification && 
    confirmedAuthorization && 
    understoodPenalties && 
    acceptedMonitoring;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-red-600">
        <CardHeader className="text-center border-b-2 border-red-600 bg-red-50">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-red-600" />
            <AlertTriangle className="h-12 w-12 text-yellow-600" />
            <Lock className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-red-800 mb-2">
            U.S. GOVERNMENT SYSTEM
          </CardTitle>
          <div className="text-xl font-semibold text-red-700 bg-red-100 border border-red-300 rounded px-4 py-2">
            AUTHORIZED USE ONLY
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-800 text-lg mb-2">WARNING</h3>
                <p className="text-yellow-700 leading-relaxed">
                  This is a U.S. Government computer system intended for official use only by authorized personnel. 
                  Unauthorized access is strictly prohibited and subject to criminal and civil penalties.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">System Monitoring</h4>
                  <p className="text-blue-700 text-sm">
                    All activities on this system are monitored and recorded. Users have no expectation of privacy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <FileText className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Data Classification</h4>
                  <p className="text-red-700 text-sm">
                    This system may contain classified or sensitive information requiring special handling.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Users className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Authorized Personnel</h4>
                  <p className="text-gray-700 text-sm">
                    Access limited to DoD personnel with valid CAC credentials and need-to-know authorization.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Shield className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-800 mb-1">Security Obligations</h4>
                  <p className="text-orange-700 text-sm">
                    Users must comply with all applicable security policies and report suspected violations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Required Acknowledgments
            </h3>
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="policy" 
                  checked={agreedToPolicy}
                  onCheckedChange={(checked) => setAgreedToPolicy(checked as boolean)}
                />
                <label htmlFor="policy" className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer">
                  I have read and agree to comply with all applicable Department of Defense and Air Force information systems security policies and procedures.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="classification" 
                  checked={acknowledgedClassification}
                  onCheckedChange={(checked) => setAcknowledgedClassification(checked as boolean)}
                />
                <label htmlFor="classification" className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer">
                  I acknowledge that this system may contain classified information and I will handle all data according to its classification level and marking requirements.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="authorization" 
                  checked={confirmedAuthorization}
                  onCheckedChange={(checked) => setConfirmedAuthorization(checked as boolean)}
                />
                <label htmlFor="authorization" className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer">
                  I confirm that I am authorized to access this system and have a legitimate need-to-know for the information contained herein.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="penalties" 
                  checked={understoodPenalties}
                  onCheckedChange={(checked) => setUnderstoodPenalties(checked as boolean)}
                />
                <label htmlFor="penalties" className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer">
                  I understand that unauthorized access, misuse, or disclosure of information on this system may result in disciplinary action, criminal prosecution, and civil penalties.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="monitoring" 
                  checked={acceptedMonitoring}
                  onCheckedChange={(checked) => setAcceptedMonitoring(checked as boolean)}
                />
                <label htmlFor="monitoring" className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer">
                  I consent to monitoring and recording of my activities on this system and understand that I have no expectation of privacy regarding my use of this system.
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View Detailed Policies
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Department of Defense Information Systems Security Policies</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <section>
                    <h4 className="font-semibold mb-2">DoD Directive 8500.01E - Information Assurance</h4>
                    <p className="text-gray-700 mb-2">
                      Establishes policy and assigns responsibilities for ensuring information assurance for DoD information systems.
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="font-semibold mb-2">DoDI 8510.01 - Risk Management Framework</h4>
                    <p className="text-gray-700 mb-2">
                      Implements the Risk Management Framework (RMF) for DoD information technology systems and platforms.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-2">CJCSI 6510.01F - Information Assurance and Support</h4>
                    <p className="text-gray-700 mb-2">
                      Provides policy and guidance for information assurance and computer network defense for Joint Staff systems.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-2">AFI 17-130 - Cybersecurity Program Management</h4>
                    <p className="text-gray-700 mb-2">
                      Establishes responsibilities and procedures for Air Force cybersecurity program management.
                    </p>
                  </section>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={onAccept}
              disabled={!canProceed}
              className={`flex-1 text-lg font-semibold py-3 ${
                canProceed 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Shield className="h-5 w-5 mr-2" />
              {canProceed ? 'Accept and Continue' : 'Complete All Acknowledgments'}
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500 border-t pt-4">
            <p>
              This warning banner provides privacy and security notices consistent with applicable federal laws, 
              directives, and other federal guidance for accessing this Government system.
            </p>
            <p className="mt-2 font-semibold">
              AMC Mission Tracking System v3.0 | U.S. Air Force Air Mobility Command
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}