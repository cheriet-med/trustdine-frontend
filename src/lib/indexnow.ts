// lib/indexnow.ts
export interface IndexNowResult {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  data?: {
    status: number;
    success: boolean;
    statusText: string;
    timestamp: string;
    urlCount: number;
  };
}

export interface BothIndexNowResults {
  bing: IndexNowResult | null;
  yandex: IndexNowResult | null;
  errors: Array<{ engine: string; error: string }>;
}

export async function submitToBingIndexNow(urls: string | string[]): Promise<IndexNowResult> {
  try {
    const response = await fetch('/api/indexnow/bing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: Array.isArray(urls) ? urls : [urls],
      }),
    });

    const result: IndexNowResult = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return result;
  } catch (error) {
    console.error('Bing IndexNow submission failed:', error);
    throw error;
  }
}

export async function submitToYandexIndexNow(urls: string | string[]): Promise<IndexNowResult> {
  try {
    const response = await fetch('/api/indexnow/yandex', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: Array.isArray(urls) ? urls : [urls],
      }),
    });

    const result: IndexNowResult = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return result;
  } catch (error) {
    console.error('Yandex IndexNow submission failed:', error);
    throw error;
  }
}

export async function submitToBothIndexNow(urls: string | string[]): Promise<BothIndexNowResults> {
  const results: BothIndexNowResults = {
    bing: null,
    yandex: null,
    errors: [],
  };

  try {
    results.bing = await submitToBingIndexNow(urls);
  } catch (error) {
    results.errors.push({ 
      engine: 'bing', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }

  try {
    results.yandex = await submitToYandexIndexNow(urls);
  } catch (error) {
    results.errors.push({ 
      engine: 'yandex', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }

  return results;
}