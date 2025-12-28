import React, { useState } from 'react';
import { Minimize2, X, Music, Square } from 'lucide-react';

export const MusicPlayer: React.FC<{ playlistId?: string }> = ({ playlistId = '4GtQVhGjAwcHFz82UKy3Ca' }) => {
    const [embedUrl, setEmbedUrl] = useState(`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&autoplay=1`);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [size] = useState<'lg'>('lg');
    const sizeConfig = {
        lg: { width: 'w-96', height: '155' }
    };

    // Stop playback by removing the iframe src
    const handleStop = () => {
        setIsPlaying(false);
        setEmbedUrl(''); // This stops the music
    };

    // Resume playback by restoring the iframe src
    const handlePlay = () => {
        setIsPlaying(true);
        setEmbedUrl(`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&autoplay=1`);
    };

    // Show floating button when hidden
    if (isHidden) {
        return (
            <>
                {/* Keep iframe in DOM but completely hidden to maintain playback */}
                {isPlaying && (
                    <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
                        <iframe 
                            src={embedUrl}
                            width="1" 
                            height="1"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            title="Tailor Swift playlist"
                        />
                    </div>
                )}
                <button
                    onClick={() => setIsHidden(false)}
                    className="fixed right-4 bottom-4 z-50 bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
                    aria-label="Show music player"
                >
                    <Music className="w-6 h-6" />
                    {isPlaying && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    )}
                </button>
            </>
        );
    }

    return (
        <div className={`fixed right-4 bottom-4 z-50 ${sizeConfig[size].width} transition-all duration-300`}>
            <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 rounded-xl shadow-2xl border-2 border-rose-300 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Music className="w-4 h-4" />
                        <span>Tailor Swift Player</span>
                        {isPlaying && (
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Stop Button */}
                        {isPlaying ? (
                            <button
                                onClick={handleStop}
                                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                                aria-label="Stop music"
                                title="Stop music"
                            >
                                <Square className="w-4 h-4 text-white fill-white" />
                            </button>
                        ) : (
                            <button
                                onClick={handlePlay}
                                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                                aria-label="Play music"
                                title="Play music"
                            >
                                <Music className="w-4 h-4 text-white" />
                            </button>
                        )}
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1.5 hover:bg-white/20 rounded transition-colors"
                            aria-label={isMinimized ? "Maximize" : "Minimize"}
                        >
                            <Minimize2 className="w-4 h-4 text-white" />
                        </button>
                        <button
                            onClick={() => setIsHidden(true)}
                            className="p-1.5 hover:bg-white/20 rounded transition-colors"
                            aria-label="Hide"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Spotify Embed - Keep in DOM when minimized, just hide visually */}
                <div className={`p-3 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 ${isMinimized ? 'hidden' : ''}`}>
                    {isPlaying ? (
                        <iframe 
                            className="rounded-lg w-full"
                            src={embedUrl}
                            width="100%" 
                            height={sizeConfig[size].height}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy" 
                            title="Tailor Swift playlist"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[155px] text-gray-500">
                            <div className="text-center">
                                <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Music stopped</p>
                                <button 
                                    onClick={handlePlay}
                                    className="mt-2 text-rose-500 hover:text-rose-600 text-sm font-medium"
                                >
                                    Click to play
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hidden iframe when minimized to keep playing */}
                {isMinimized && isPlaying && (
                    <div className="h-0 overflow-hidden">
                        <iframe 
                            src={embedUrl}
                            width="1" 
                            height="1"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            title="Tailor Swift playlist"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicPlayer;
