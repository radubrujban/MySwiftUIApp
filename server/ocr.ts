import OpenAI from "openai";

// Create OpenAI client with proper error handling
function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  
  console.log(`OpenAI API Key configured: ${apiKey.substring(0, 8)}...${apiKey.slice(-4)}`);
  return new OpenAI({ apiKey });
}

export interface AMCFlightLeg {
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
}

export interface AMCOcrResult {
  legs: AMCFlightLeg[];
  formType: string;
  missionType?: string;
  confidence: number;
}

export async function processAMCDocument(imageBuffer: Buffer): Promise<AMCOcrResult> {
  try {
    // Create fresh OpenAI client for each request
    const openai = createOpenAIClient();
    
    // Convert buffer to base64 and detect format
    const base64Image = imageBuffer.toString('base64');
    
    // Detect image format for proper MIME type
    let mimeType = 'image/jpeg'; // default
    const header = imageBuffer.slice(0, 12);
    
    if (header.includes(Buffer.from('HEIC'))) {
      mimeType = 'image/heic';
      console.log('Processing HEIC image from iPhone');
    } else if (header[0] === 0xFF && header[1] === 0xD8) {
      mimeType = 'image/jpeg';
    } else if (header.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) {
      mimeType = 'image/png';
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert at reading AMC IMI 170 (Individual Mission Itinerary) forms used by Air Mobility Command. Extract ALL flight legs from the document in the exact format specified.

CRITICAL: Extract EVERY flight leg visible in the document. AMC IMI 170 forms contain multiple flight legs arranged in rows/tables.

For each flight leg, extract exactly these fields in this order:
1. Departure ICAO code (4 letters like KTCM)
2. Arrival ICAO code (4 letters like KPSM) 
3. Departure time (4 digits like 1720)
4. Arrival time (4 digits like 2215)
5. Tail number (like 08-8196)
6. Mission number (like PMZF1301C147)
7. Flying hours (decimal like 4.9)
8. Cargo weight in pounds (like 73900)
9. PAX count (number like 0)

Respond with JSON in this exact format:
{
  "legs": [
    {
      "departureIcao": "extracted ICAO or empty string",
      "departureName": "extracted name or empty string",
      "arrivalIcao": "extracted ICAO or empty string", 
      "arrivalName": "extracted name or empty string",
      "departureTime": "extracted time or empty string",
      "arrivalTime": "extracted time or empty string",
      "duration": "extracted duration or empty string",
      "missionNumber": "extracted mission number or empty string",
      "aircraftType": "extracted aircraft type or empty string",
      "tailNumber": "extracted tail number or empty string",
      "pax": "extracted pax count or 0",
      "cargoWeight": "extracted weight or 0",
      "cargoType": "extracted cargo type or empty string",
      "specialHandling": "extracted special handling or empty string"
    }
  ],
  "formType": "AMC IMI 170",
  "missionType": "extracted mission type or empty string",
  "confidence": "actual confidence score between 0 and 1"
}

EXTRACT ALL LEGS - do not stop at the first one. Look for multiple rows of flight data in the document.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract all flight leg information from this AMC IMI 170 document:"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate the response structure
    if (!result.legs || !Array.isArray(result.legs)) {
      throw new Error('Invalid OCR response format');
    }

    // Ensure required fields are present
    result.legs = result.legs.map((leg: any) => ({
      departureIcao: leg.departureIcao || 'UNKN',
      departureName: leg.departureName || 'Unknown Airport',
      arrivalIcao: leg.arrivalIcao || 'UNKN',
      arrivalName: leg.arrivalName || 'Unknown Airport',
      departureTime: leg.departureTime || '0000L',
      arrivalTime: leg.arrivalTime || '0000L',
      duration: leg.duration || '0:00',
      missionNumber: leg.missionNumber || 'UNKNOWN',
      aircraftType: leg.aircraftType || null,
      tailNumber: leg.tailNumber || null,
      pax: typeof leg.pax === 'number' ? leg.pax : 0,
      cargoWeight: typeof leg.cargoWeight === 'number' ? leg.cargoWeight : 0,
      cargoType: leg.cargoType || null,
      specialHandling: leg.specialHandling || null
    }));

    return {
      legs: result.legs,
      formType: result.formType || 'AMC IMI 170',
      missionType: result.missionType,
      confidence: typeof result.confidence === 'number' ? result.confidence : 0.8
    };

  } catch (error: any) {
    console.error('OCR processing error:', error);
    throw error; // Don't provide fallback data, let the error bubble up
  }
}

export function validateAMCData(result: AMCOcrResult): boolean {
  if (!result.legs || result.legs.length === 0) {
    return false;
  }

  return result.legs.every(leg => 
    leg.departureIcao && 
    leg.arrivalIcao && 
    leg.missionNumber &&
    typeof leg.pax === 'number' &&
    typeof leg.cargoWeight === 'number'
  );
}