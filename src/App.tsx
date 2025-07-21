import React, { useState } from 'react';
import { GitBranch as BrandTiktok, Loader } from 'lucide-react';

interface VideoDetails {
  id: number;
  title: string;
  url: string;
  stats: {
    likeCount: number;
    commentCount: number;
    shareCount: number;
    playCount: string;
    saveCount: number;
  };
  video: {
    noWatermark: string;
    watermark: string;
    cover: string;
    dynamic_cover: string;
    origin_cover: string;
    width: number;
    height: number;
    durationFormatted: string;
    duration: number;
    ratio: string;
  };
  author: {
    id: string;
    name: string;
    unique_id: string;
    signature?: string;
    avatar: string;
    avatar_thumb: string;
  };
  music?: {
    id: number;
    title: string;
    author: string;
    play_url: string;
    // tambahkan properti music lainnya jika diperlukan
  };
}

// Additional component for stats items
const StatItem = ({ icon, value, label }: { icon: string; value: number | string; label: string }) => (
  <div className="bg-white/5 p-3 rounded-lg">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-lg font-medium">{value}</div>
    <div className="text-xs text-gray-400 mt-1">{label}</div>
  </div>
);

function App() {
  const [url, setUrl] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoReady, setVideoReady] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  setVideoDetails(null);
  setDownloadLink('');
  setVideoReady(false);

  try {
    // Validasi URL
    if (!url.includes('tiktok.com')) {
      throw new Error('Please enter a valid TikTok URL');
    }

    const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Periksa keberadaan noWatermark link
    if (data?.video?.noWatermark) {
      setVideoDetails(data);
      setDownloadLink(data.video.noWatermark);
      setVideoReady(true);
    } else {
      throw new Error('No download link found in response');
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to get download link. Please check the URL and try again.');
    console.error('API Error:', err);
  } finally {
    setLoading(false);
  }
};

  const handleDownload = () => {
    if (downloadLink) {
      window.open(downloadLink, '_blank');
    } else {
      setError('Download link is invalid.');
    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Improved Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-6">
            <BrandTiktok className="w-16 h-16 mx-auto text-pink-500" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">
            TikTok Downloader
          </h1>
          <p className="text-gray-300 text-lg max-w-lg mx-auto">
            Download HD TikTok videos without watermark. Fast, free, and easy to use!
          </p>
        </div>

        {/* Main Card - Enhanced with better spacing and animations */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-xl border border-white/20 hover:shadow-2xl transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* Improved Input with icon and better hover effects */}
            <div className="relative w-full max-w-md mb-6">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste TikTok video URL here..."
                className="px-6 py-4 w-full bg-white/10 border border-gray-300/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 hover:border-pink-400/50 transition-all duration-200 pl-12"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            
            {/* Button with better loading state */}
            <button
              type="submit"
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                loading 
                  ? 'bg-pink-700 cursor-not-allowed' 
                  : 'bg-pink-500 hover:bg-pink-600 shadow-lg hover:shadow-pink-500/30'
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <BrandTiktok size={18} />
                  Get Video
                </>
              )}
            </button>
          </form>

          {/* Video Preview Section - Enhanced layout */}
          {videoReady && videoDetails && (
            <div className="mt-10 animate-fade-in-up">
              <div className="flex items-center mb-6">
                <img 
                  src={videoDetails.author.avatar_thumb} 
                  alt={videoDetails.author.name}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-pink-500"
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {videoDetails.author.name} 
                    <span className="text-gray-400 ml-2">@{videoDetails.author.unique_id}</span>
                  </h2>
                  {videoDetails.author.signature && (
                    <p className="text-sm text-gray-400 mt-1">{videoDetails.author.signature}</p>
                  )}
                </div>
              </div>

              <p className="text-lg mb-6 px-4 py-3 bg-white/5 rounded-lg">
                "{videoDetails.title}"
              </p>

              {/* Video Container with responsive sizing */}
              <div className="relative group">
                <video
                  className="w-full max-w-md mx-auto rounded-xl object-cover shadow-lg group-hover:ring-2 group-hover:ring-pink-500 transition-all duration-300"
                  controls
                  src={downloadLink}
                  poster={videoDetails.video.cover}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 rounded-full p-3">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stats with better visual hierarchy */}
              <div className="grid grid-cols-5 gap-2 mt-6 text-center">
                <StatItem icon="❤️" value={videoDetails.stats.likeCount} label="Likes" />
                <StatItem icon="💬" value={videoDetails.stats.commentCount} label="Comments" />
                <StatItem icon="🔁" value={videoDetails.stats.shareCount} label="Shares" />
                <StatItem icon="▶️" value={videoDetails.stats.playCount} label="Plays" />
                <StatItem icon="💾" value={videoDetails.stats.saveCount || 0} label="Saves" />
              </div>

              {/* Download Button with icon */}
              <button
                onClick={handleDownload}
                className="mt-8 w-full max-w-md mx-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Video (No Watermark)
              </button>
            </div>
          )}

          {/* Error Message with better styling */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Error!</p>
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm mt-12">
          <p>Disclaimer: This tool is not affiliated with TikTok. Use at your own responsibility.</p>
        </div>
      </div>
    </div>
  </div>
);


}

export default App;
