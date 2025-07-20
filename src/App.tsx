import React, { useState } from 'react';
import { GitBranch as BrandTiktok, Loader } from 'lucide-react';

interface VideoDetails {
  author: {
    nickname: string;
    avatar: string;
  };
  desc: string;
  statistics: {
    likeCount: number;
    commentCount: number;
    shareCount: number;
    playCount: number;
  };
  video: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [downloadLink, setDownloadLink] = useState('');
  const [error, setError] = useState('');
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setVideoDetails(null);
    setDownloadLink('');
    setVideoReady(false);

    const apiUrl = `https://api.tiklydown.eu.org/api/download/v3?url=${encodeURIComponent(url)}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch the download link.');
      }

      const data = await response.json();

      if (data?.status === 200 && data?.result?.video) {
        setDownloadLink(data.result.video);
        setVideoDetails(data.result);
        setVideoReady(true);
      } else {
        throw new Error('No download link found.');
      }
    } catch (err) {
      setError('An error occurred while fetching the download link.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadLink) {
      window.location.href = downloadLink; // This will download the video
    } else {
      setError('Download link is invalid.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">
              TikTok Downloader
            </h1>
            <p className="text-gray-300 text-lg">Download your favorite TikTok videos in high quality</p>
          </div>

          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-xl">
            {/* Platform Selection */}
            <div className="flex gap-4 justify-center mb-8">
              <button
                onClick={() => setPlatform('tiktok')}
                className={flex items-center gap-2 px-8 py-4 rounded-xl transition transform hover:scale-105 ${
                  platform === 'tiktok'
                    ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white/5 hover:bg-white/20'
                }}
              >
                <BrandTiktok size={24} />
                TikTok
              </button>
            </div>

            {/* URL Input Form */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste TikTok Video URL"
                className="px-4 py-2 mb-4 w-80 bg-white/10 border border-gray-300 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-700 transition-colors"
              >
                {loading ? <Loader size={16} className="animate-spin" /> : 'Get Video'}
              </button>
            </form>

            {/* Video Display */}
            {videoReady && videoDetails && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold">{videoDetails.author.nickname}</h2>
                <p className="text-lg">{videoDetails.desc}</p>
                <div className="relative mt-4">
                  <video
                    className="w-[210px] mx-auto rounded-xl object-contain"
                    controls
                    src={downloadLink}
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Download Video
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;