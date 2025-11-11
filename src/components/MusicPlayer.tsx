import React, { useState } from 'react';
import { Minimize2, Maximize2, X, Music } from 'lucide-react';

export const MusicPlayer: React.FC<{ playlistId?: string }> = ({ playlistId = '4GtQVhGjAwcHFz82UKy3Ca' }) => {
    const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&autoplay=1`;
    const [isMinimized, setIsMinimized] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
    const sizeConfig = {
        sm: { width: 'w-64', height: '60' },
        md: { width: 'w-80', height: '80' },
        lg: { width: 'w-96', height: '152' }
    };

    if (isHidden) {
        return (
            <button
                onClick={() => setIsHidden(false)}
                className="fixed right-4 bottom-4 z-50 bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
                aria-label="Show music player"
            >
                <Music className="w-6 h-6" />
            </button>
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
                    </div>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => { 
                                const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
                                setSize(sizes[(sizes.indexOf(size) + 1) % 3]);
                            }} 
                            className="p-1.5 hover:bg-white/20 rounded transition-colors"
                            aria-label="Resize"
                        >
                            <Maximize2 className="w-4 h-4 text-white" />
                        </button>
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

                {/* Spotify Embed */}
                {!isMinimized && (
                    <div className="p-3 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
                        <iframe 
                            className="rounded-lg w-full"
                            src={embedUrl}
                            width="100%" 
                            height={sizeConfig[size].height}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy" 
                            title="Tailor Swift playlist"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicPlayer;
