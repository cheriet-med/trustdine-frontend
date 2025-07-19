// types/receipt.ts
export interface ExtractedData {
    restaurantName: string;
    date: string;
    time?: string;
    total: string;
    items?: string[];
    location?: string;
    taxAmount?: string;
  }
  
  export interface ValidationResult {
    status: 'VALID' | 'NEEDS_REVIEW' | 'REJECTED';
    confidence: number;
    extractedData: ExtractedData | null;
    validationReasons: string[];
    flags?: string[];
    processingTime: number;
  }
  
  export interface ValidationScenario {
    [key: string]: ValidationResult;
  }