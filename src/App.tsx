import React, { useState } from 'react';
import { GitBranch as BrandTiktok, Loader } from 'lucide-react';

interface VideoDetails {
  id: number;
  title: string;
  stats: {
    likeCount: number;
    commentCount: number;
    shareCount: number;
    playCount: string | number;
    saveCount?: number;
  };
  video: {
    noWatermark: string;
    cover: string;
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
  };
}

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

    const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch the download link.');
      }

      const data = await response.json();

      if (data?.status === 200 && data?.result) {
        const videoData = data.result as VideoDetails;
        setVideoDetails(videoData);
        setDownloadLink(videoData.video.noWatermark);
        setVideoReady(true);
      } else {
        throw new Error('No download link found.');
      }
    } catch (err) {
      setError('An error occurred while fetching the download link.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadLink) {
      window.location.href = downloadLink;
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

          {/* Input Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-xl">
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
                disabled={loading}
              >
                {loading ? <Loader size={16} className="animate-spin" /> : 'Get Video'}
              </button>
            </form>

            {/* Video Detail Display */}
            {videoReady && videoDetails && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold">{videoDetails.author.name} (@{videoDetails.author.unique_id})</h2>
                {videoDetails.author.signature && <p className="italic text-sm mb-2">{videoDetails.author.signature}</p>}
                <p className="text-lg mb-4">{videoDetails.title}</p>
                <video
                  className="w-[210px] mx-auto rounded-xl object-contain"
                  controls
                  src={downloadLink}
                />
                <div className="flex justify-center gap-6 mt-4 text-sm text-gray-300">
                  <span>❤️ {videoDetails.stats.likeCount}</span>
                  <span>💬 {videoDetails.stats.commentCount}</span>
                  <span>🔁 {videoDetails.stats.shareCount}</span>
                  <span>▶️ {videoDetails.stats.playCount}</span>
                  <span>💾 {videoDetails.stats.saveCount ?? '-'}</span>
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Download Video
                </button>
              </div>
            )}

            {/* Error */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
