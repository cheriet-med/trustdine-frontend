
// lib/validationEngine.ts
import { ValidationResult, ValidationScenario } from '@/types/receipt';

export class ReceiptValidationEngine {
  private static validationScenarios: ValidationScenario = {
    'clear_receipt.jpg': {
      status: 'VALID',
      confidence: 92,
      extractedData: {
        restaurantName: 'Pasta Bella Roma',
        date: '2025-06-15',
        time: '19:45',
        total: '€47.80',
        items: ['Carbonara €18.50', 'Tiramisu €8.00', 'House Wine €15.00', 'Service €6.30'],
        location: 'Via Roma 123, Milan',
        taxAmount: '€9.56'
      },
      validationReasons: [
        'Clear receipt image quality',
        'Restaurant found in database',
        'Amount within expected range',
        'Date matches recent timeframe',
        'Tax calculation verified'
      ],
      processingTime: 1.2
    },
    'blurry_receipt.jpg': {
      status: 'NEEDS_REVIEW',
      confidence: 67,
      extractedData: {
        restaurantName: 'Le Petit [unclear]',
        date: '2025-06-15',
        total: '€89.50',
        items: ['[unclear] €--', 'Wine bottle €35.00', '[unclear] €--'],
        location: 'Paris [unclear]'
      },
      validationReasons: [
        'Image quality below optimal threshold',
        'Some text extraction uncertain',
        'Restaurant name partially obscured',
        'Amount seems high for detected items'
      ],
      flags: ['IMAGE_QUALITY', 'PARTIAL_OCR', 'AMOUNT_ANOMALY'],
      processingTime: 2.1
    },
    'suspicious_receipt.jpg': {
      status: 'REJECTED',
      confidence: 23,
      extractedData: {
        restaurantName: 'Fake Restaurant XYZ',
        date: '2025-05-01',
        total: '€200.00'
      },
      validationReasons: [
        'Receipt format doesn\'t match known templates',
        'Restaurant not found in database',
        'Receipt date too old (45+ days)',
        'Font inconsistencies detected',
        'Tax calculation errors'
      ],
      flags: ['UNKNOWN_RESTAURANT', 'OLD_RECEIPT', 'FAKE_FORMAT', 'TAX_ERROR'],
      processingTime: 0.8
    }
  };

  static async validateReceipt(file: File): Promise<ValidationResult> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Determine scenario based on filename (for demo purposes)
    let scenario: ValidationResult;
    
    if (file.name.includes('clear') || file.name.includes('good')) {
      scenario = this.validationScenarios['clear_receipt.jpg'];
    } else if (file.name.includes('blur') || file.name.includes('unclear')) {
      scenario = this.validationScenarios['blurry_receipt.jpg'];
    } else if (file.name.includes('fake') || file.name.includes('bad')) {
      scenario = this.validationScenarios['suspicious_receipt.jpg'];
    } else {
      // Random scenario for demo
      const scenarios = Object.values(this.validationScenarios);
      scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    }
    
    return scenario;
  }

  static calculateConfidence(factors: {
    imageQuality: number;
    dataExtraction: number;
    businessRules: number;
    restaurantMatch: number;
    userHistory: number;
  }): number {
    const weights = {
      imageQuality: 0.25,
      dataExtraction: 0.20,
      businessRules: 0.30,
      restaurantMatch: 0.15,
      userHistory: 0.10
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([factor, weight]) => {
      if (factors[factor as keyof typeof factors] !== undefined) {
        totalScore += factors[factor as keyof typeof factors] * weight;
        totalWeight += weight;
      }
    });

    return Math.round((totalScore / totalWeight) * 100);
  }
}