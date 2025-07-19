'use client';
import React ,{ useState, ChangeEvent, FormEvent } from 'react';

interface IndexNowResult {
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

interface BothIndexNowResults {
  bing: IndexNowResult | null;
  yandex: IndexNowResult | null;
  errors: Array<{ engine: string; error: string }>;
}

interface LoadingState {
  bing: boolean;
  yandex: boolean;
  both: boolean;
}

interface ResultsState {
  bing: IndexNowResult | null;
  yandex: IndexNowResult | null;
  both: BothIndexNowResults | null;
}

interface ErrorsState {
  bing: string | null;
  yandex: string | null;
  both: string | null;
}

interface ResultCardProps {
  title: string;
  result: IndexNowResult | BothIndexNowResults | null;
  error: string | null;
  bgColor: string;
}

export default function IndexNowDashboard(): React.JSX.Element {
  const [urls, setUrls] = useState<string>('');
  const [loading, setLoading] = useState<LoadingState>({
    bing: false,
    yandex: false,
    both: false,
  });
  const [results, setResults] = useState<ResultsState>({
    bing: null,
    yandex: null,
    both: null,
  });
  const [errors, setErrors] = useState<ErrorsState>({
    bing: null,
    yandex: null,
    both: null,
  });

  const parseUrls = (urlString: string): string[] => {
    return urlString
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0 && (url.startsWith('http://') || url.startsWith('https://')));
  };

  const submitToBing = async (): Promise<void> => {
    const urlList = parseUrls(urls);
    if (urlList.length === 0) {
      alert('Please enter valid URLs (one per line)');
      return;
    }

    setLoading(prev => ({ ...prev, bing: true }));
    setErrors(prev => ({ ...prev, bing: null }));
    setResults(prev => ({ ...prev, bing: null }));

    try {
      const response = await fetch('/api/indexnow/bing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urlList }),
      });

      const result: IndexNowResult = await response.json();
      
      if (result.success) {
        setResults(prev => ({ ...prev, bing: result }));
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({ ...prev, bing: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, bing: false }));
    }
  };

  const submitToYandex = async (): Promise<void> => {
    const urlList = parseUrls(urls);
    if (urlList.length === 0) {
      alert('Please enter valid URLs (one per line)');
      return;
    }

    setLoading(prev => ({ ...prev, yandex: true }));
    setErrors(prev => ({ ...prev, yandex: null }));
    setResults(prev => ({ ...prev, yandex: null }));

    try {
      const response = await fetch('/api/indexnow/yandex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urlList }),
      });

      const result: IndexNowResult = await response.json();
      
      if (result.success) {
        setResults(prev => ({ ...prev, yandex: result }));
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({ ...prev, yandex: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, yandex: false }));
    }
  };

  const submitToBoth = async (): Promise<void> => {
    const urlList = parseUrls(urls);
    if (urlList.length === 0) {
      alert('Please enter valid URLs (one per line)');
      return;
    }

    setLoading(prev => ({ ...prev, both: true }));
    setErrors(prev => ({ ...prev, both: null }));
    setResults(prev => ({ ...prev, both: null }));

    try {
      const [bingResponse, yandexResponse] = await Promise.allSettled([
        fetch('/api/indexnow/bing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: urlList }),
        }).then(res => res.json()),
        fetch('/api/indexnow/yandex', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: urlList }),
        }).then(res => res.json())
      ]);

      const bothResults: BothIndexNowResults = {
        bing: bingResponse.status === 'fulfilled' ? bingResponse.value : null,
        yandex: yandexResponse.status === 'fulfilled' ? yandexResponse.value : null,
        errors: []
      };

      if (bingResponse.status === 'rejected') {
        const error = bingResponse.reason instanceof Error ? bingResponse.reason.message : 'Unknown error';
        bothResults.errors.push({ engine: 'Bing', error });
      }
      if (yandexResponse.status === 'rejected') {
        const error = yandexResponse.reason instanceof Error ? yandexResponse.reason.message : 'Unknown error';
        bothResults.errors.push({ engine: 'Yandex', error });
      }

      setResults(prev => ({ ...prev, both: bothResults }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({ ...prev, both: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, both: false }));
    }
  };

  const clearResults = (): void => {
    setResults({ bing: null, yandex: null, both: null });
    setErrors({ bing: null, yandex: null, both: null });
  };

  const handleUrlsChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setUrls(e.target.value);
  };

  const isIndexNowResult = (result: IndexNowResult | BothIndexNowResults): result is IndexNowResult => {
    return 'success' in result && typeof result.success === 'boolean';
  };

  const isBothIndexNowResults = (result: IndexNowResult | BothIndexNowResults): result is BothIndexNowResults => {
    return 'bing' in result && 'yandex' in result && 'errors' in result;
  };

  const ResultCard = ({ title, result, error, bgColor }: ResultCardProps): React.JSX.Element => (
    <div className={`${bgColor} p-4 rounded-lg border`}>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2">
          <strong>Error:</strong> {error}
        </div>
      )}
      {result && (
        <div className="space-y-2">
          {isIndexNowResult(result) && (
            <>
              <div className={`px-3 py-2 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>Status:</strong> {result.success ? 'Success' : 'Failed'}
              </div>
              {result.message && (
                <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded">
                  <strong>Message:</strong> {result.message}
                </div>
              )}
              {result.data && (
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm">
                  <strong>Details:</strong> Status {result.data.status}, {result.data.urlCount} URLs, {new Date(result.data.timestamp).toLocaleString()}
                </div>
              )}
            </>
          )}
          {isBothIndexNowResults(result) && (
            <div className="space-y-2">
              {result.bing && (
                <div className="bg-blue-50 p-3 rounded">
                  <strong>Bing:</strong> {result.bing.success ? 'Success' : 'Failed'} - {result.bing.message}
                </div>
              )}
              {result.yandex && (
                <div className="bg-red-50 p-3 rounded">
                  <strong>Yandex:</strong> {result.yandex.success ? 'Success' : 'Failed'} - {result.yandex.message}
                </div>
              )}
              {result.errors && result.errors.length > 0 && (
                <div className="bg-yellow-50 p-3 rounded">
                  <strong>Errors:</strong>
                  {result.errors.map((err, idx) => (
                    <div key={idx} className="ml-2">• {err.engine}: {err.error}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IndexNow Dashboard</h1>
          <p className="text-gray-600 mb-6">Submit URLs to search engines for instant indexing</p>
          
          <div className="mb-6">
            <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-2">
              URLs to Submit (one per line)
            </label>
            <textarea
              id="urls"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/page1
https://example.com/page2
https://example.com/page3"
              value={urls}
              onChange={handleUrlsChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter one URL per line. Only HTTP/HTTPS URLs are valid.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={submitToBing}
              disabled={loading.bing || !urls.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading.bing && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              Submit to Bing
            </button>

            <button
              onClick={submitToYandex}
              disabled={loading.yandex || !urls.trim()}
              className="px-6 py-2 bg-yel text-black rounded-md hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading.yandex && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              Submit to Yandex
            </button>

            <button
              onClick={submitToBoth}
              disabled={loading.both || !urls.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading.both && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              Submit to Both
            </button>

            <button
              onClick={clearResults}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>

          {(results.bing || results.yandex || results.both || errors.bing || errors.yandex || errors.both) && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(results.bing || errors.bing) && (
                  <ResultCard
                    title="Bing IndexNow"
                    result={results.bing}
                    error={errors.bing}
                    bgColor="bg-blue-50"
                  />
                )}
                
                {(results.yandex || errors.yandex) && (
                  <ResultCard
                    title="Yandex IndexNow"
                    result={results.yandex}
                    error={errors.yandex}
                    bgColor="bg-red-50"
                  />
                )}
                
                {(results.both || errors.both) && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <ResultCard
                      title="Both Engines"
                      result={results.both}
                      error={errors.both}
                      bgColor="bg-green-50"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Tips:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• URLs must start with http:// or https://</li>
              <li>• Maximum 10,000 URLs per submission (recommended: 100-1000)</li>
              <li>• IndexNow works best for new or updated content</li>
              <li>• Both engines use the same IndexNow key and format</li>
              <li>• Results are processed asynchronously by search engines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}