import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUrlStore } from "../store/urlStore";

const Shortener = () => {
  const {
    urls,
    loading,
    error,
    latestShortUrl,
    fetchUrls,
    createUrl,
    deleteUrl,
    clearLatest,
  } = useUrlStore();

  const [longUrl, setLongUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [showCustomUrl, setShowCustomUrl] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await createUrl({ longUrl, customUrl });

    if (res.success) {
      setLongUrl("");
      setCustomUrl("");
      setShowCustomUrl(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] py-6 px-3 sm:px-4">
      <div className="w-full max-w-xl fade-in">

        {/* ERROR */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-blue-100 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-700">
            Shorten Your URL
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Enter your long URL
              </label>
              <input
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="input-field mt-1"
                placeholder="https://example.com"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setShowCustomUrl(!showCustomUrl)}
              className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              {showCustomUrl ? "Hide Custom URL" : "Add Custom URL"}
            </button>

            {showCustomUrl && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Custom URL (optional)
                </label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="input-field mt-1"
                  placeholder="custom-name"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg"
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>

          {/* RESULT */}
          {latestShortUrl && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">
                Your shortened URL:
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={latestShortUrl}
                  readOnly
                  className="input-field"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(latestShortUrl);
                    clearLatest();
                  }}
                  className="btn-primary w-full sm:w-auto"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* URL LIST */}
        {urls.length > 0 && (
          <div className="mt-6 w-full fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Your Shortened URLs
            </h2>

            {/* DESKTOP TABLE */}
            <div className="hidden sm:block">
              <table className="min-w-full bg-white rounded-lg shadow border">
                <thead>
                  <tr className="bg-blue-50 text-blue-700">
                    <th className="py-2 px-3 text-left">Short URL</th>
                    <th className="py-2 px-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url) => (
                    <tr key={url._id} className="border-t hover:bg-blue-50">
                      <td className="py-2 px-3 text-blue-600 font-semibold break-all">
                        <Link to={url.shortenedUrl} target="_blank">
                          {url.shortenedUrl}
                        </Link>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => deleteUrl(url._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="sm:hidden space-y-3">
              {urls.map((url) => (
                <div
                  key={url._id}
                  className="bg-white rounded-lg shadow p-4 border"
                >
                  <p className="text-sm text-gray-500 mb-1">
                    Short URL
                  </p>

                  <a
                    href={url.shortenedUrl}
                    target="_blank"
                    className="text-blue-600 font-semibold break-all block mb-3"
                  >
                    {url.shortenedUrl}
                  </a>

                  <button
                    onClick={() => deleteUrl(url._id)}
                    className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shortener;
