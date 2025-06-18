// OCR utilities for AMC IMI 170 document processing
// AMC IMI 170 (Individual Mission Itinerary) forms contain standardized routing,
// passenger manifests, cargo details, and mission-specific information

export interface OcrResult {
  legs: Array<{
    departureIcao: string;
    departureName: string;
    arrivalIcao: string;
    arrivalName: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    missionNumber: string;
    aircraftType?: string;
    tailNumber?: string;
    pax: number;
    cargoWeight: number;
    cargoType?: string;
    specialHandling?: string;
  }>;
  formType?: string;
  missionType?: string;
  commandingOfficer?: string;
}

export async function processDocument(file: File): Promise<OcrResult> {
  // This function is not used in the current implementation
  // Real OCR processing happens on the server side
  throw new Error('Client-side OCR processing is not implemented. Use server-side scanning.');
}

export function validateOcrResult(result: OcrResult): boolean {
  return result.legs.every(leg => 
    leg.departureIcao && 
    leg.arrivalIcao && 
    leg.missionNumber && 
    typeof leg.pax === 'number' && 
    typeof leg.cargoWeight === 'number'
  );
}
