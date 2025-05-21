import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Shortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [password, setPassword] = useState('');
  const [showCustomUrl, setShowCustomUrl] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all URLs
  const fetchUrls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/url/shorten', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log('Fetched URLs:', data);
      if (response.ok) {
        setUrlList(Array.isArray(data.urls) ? data.urls : []);
        setError(null);
      } else {
        setError(data.message || data.error || 'Failed to fetch URLs');
      }
    } catch (error) {
      setError('Failed to fetch URLs');
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  // Add new URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/v1/url/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ longUrl, customUrl, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Add data failed');
        return { success: false, error: data.message || data.error || 'Add data failed' };
      }

      setShortenedUrl(data.result.shortenedUrl);
      setError(null);
      setLongUrl('');
      setCustomUrl('');
      setPassword('');
      setShowCustomUrl(false);
      setShowPassword(false);

      // Refresh list after adding
      fetchUrls();

      return { success: true };
    } catch (error) {
      setError(error.message || 'Add data failed');
      return { success: false, error: error.message };
    }
  };

  // Delete URL
  const handleDelete = async (id) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/url/shorten', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.ok) {
        setError(null);
        // Refresh list after deletion
        fetchUrls();
      } else {
        setError(data.message || data.error || 'Delete failed');
      }
    } catch (error) {
      setError('Delete failed');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] py-8 px-2">
      <div className="w-full max-w-xl fade-in">
        {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 mb-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Shorten Your URL</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="longUrl" className="block text-sm font-semibold text-gray-700 mb-1">
                Enter your long URL
              </label>
              <input
                type="url"
                id="longUrl"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="input-field mt-1"
                placeholder="https://example.com/very/long/url"
                required
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setShowCustomUrl(!showCustomUrl)}
                className={`px-4 py-2 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium transition-colors ${showCustomUrl ? 'ring-2 ring-blue-400' : ''}`}
              >
                {showCustomUrl ? 'Hide Custom URL' : 'Add Custom URL'}
              </button>
              {/* <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`px-4 py-2 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium transition-colors ${showPassword ? 'ring-2 ring-blue-400' : ''}`}
              >
                {showPassword ? 'Hide Password Protection' : 'Add Password Protection'}
              </button> */}
            </div>
            {showCustomUrl && (
              <div>
                <label htmlFor="customUrl" className="block text-sm font-semibold text-gray-700 mb-1">
                  Custom URL (optional)
                </label>
                <input
                  type="text"
                  id="customUrl"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="input-field mt-1"
                  placeholder="custom-name"
                />
              </div>
            )}
            {/* {showPassword && (
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                  Password Protection
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field mt-1"
                  placeholder="Enter password"
                />
              </div>
            )} */}
            <button type="submit" className="btn-primary w-full text-lg" >
              Shorten URL
            </button>
          </form>
          {shortenedUrl && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Your shortened URL:</p>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={shortenedUrl}
                  readOnly
                  className="input-field"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(shortenedUrl)}
                  className="btn-primary"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Table of shortened URLs */}
        {urlList.length > 0 && (
          <div className="mt-10 w-full fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Shortened URLs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow border">
                <thead>
                  <tr className="bg-blue-50 text-blue-700">
                    {/* <th className="py-2 px-3 text-left">Original URL</th> */}
                    <th className="py-2 px-3 text-left">Short URL</th>
                 
                    {/* <th className="py-2 px-3 text-left">Password</th> */}
                    <th className="py-2 px-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urlList.map((url) => (
                    <tr key={url._id} className="border-t hover:bg-blue-50">
                      <td
                        className="py-2 px-3 text-blue-600 font-semibold cursor-pointer"
                        onClick={() => navigator.clipboard.writeText(url.shortenedUrl)}
                        title="Copy"
                      >
                       <Link to={url.shortenedUrl} target='blank'>{url.shortenedUrl}</Link> 
                      </td>
                      {/* <td className="py-2 px-3">{url.passord ? 'Yes' : 'No'}</td> */}
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleDelete(url._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shortener;