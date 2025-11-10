import React, { useEffect, useState } from 'react';

/**
 * Persistent Spotify iframe player. Autoplay may be blocked by browsers; we
 * attempt to load the iframe on mount and let the user stop/start playback.
 * When stopped, the iframe src is cleared to halt playback.
 */
export const MusicPlayer: React.FC<{ playlistId?: string }> = ({
    playlistId = '4GtQVhGjAwcHFz82UKy3Ca', // default playlist
}) => {
    const embedBase = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
    const [isPlaying, setIsPlaying] = useState<boolean>(() => {
        try {
            return localStorage.getItem('rt_player_playing') === '1';
        } catch {
            return false;
        }
    });
    const [src, setSrc] = useState<string>(isPlaying ? embedBase : '');
    const [showPrompt, setShowPrompt] = useState<boolean>(false);

    useEffect(() => {
        try {
            localStorage.setItem('rt_player_playing', isPlaying ? '1' : '0');
        } catch (e) {
            // ignore storage errors in private/incognito modes
            console.debug('localStorage write failed', e);
        }
        // Toggle iframe src to start/stop playback
        if (isPlaying) {
            setSrc(embedBase);
            setShowPrompt(false); // hide prompt when playing
        } else {
            // Removing src stops playback instantly
            setSrc('');
        }
    }, [isPlaying, embedBase]);

    // Attempt to auto-start on first load (may be blocked by browser)
    useEffect(() => {
        // Try to set playing true once on mount to request autoplay; user gesture may still be required
        const tried = sessionStorage.getItem('rt_player_autoplay_tried');
        if (!tried) {
            try {
                setIsPlaying(true);
                sessionStorage.setItem('rt_player_autoplay_tried', '1');
                // Show friendly prompt after a short delay if autoplay likely blocked
                setTimeout(() => {
                    // If still not playing after attempt, show prompt
                    const stillPlaying = localStorage.getItem('rt_player_playing') === '1';
                    if (!stillPlaying) {
                        setShowPrompt(true);
                    }
                }, 1500);
            } catch (e) {
                console.debug('autoplay attempt failed', e);
                setShowPrompt(true);
            }
        }
    }, []);

    return (
        <div className="fixed right-4 bottom-4 z-50 w-105">
            <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-xl shadow-2xl p-4 flex flex-col border-3 border-rose-300">
                <div className="flex items-center justify-between px-2 mb-2">
                    <div className="text-sm font-bold text-rose-700 flex items-center gap-2">
                        Tailor Swift Player
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            aria-label={isPlaying ? 'Pause music' : 'Play music'}
                            onClick={() => {
                                setIsPlaying((s) => !s);
                                setShowPrompt(false);
                            }}
                            className="btn-primary btn-sm shadow-lg"
                        >
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                    </div>
                </div>

                <div className="mt-2">
                    {showPrompt && !isPlaying && (
                        <div className="bg-rose-100 border-2 border-rose-300 rounded-lg px-3 py-3 mb-2">
                            <p className="text-xs text-rose-800 font-medium">
                                Click <strong>Play</strong> to enjoy Tailor Swift music while you work! 💝
                            </p>
                        </div>
                    )}
                    {src ? (
                        <iframe
                            data-testid="embed-iframe"
                            className="rounded-md"
                            src={src}
                            width="100%"
                            height="80"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            title="Tailor Swift playlist"
                        />
                    ) : (
                            <div className="text-xs text-gray-500 px-2 py-6 text-center">
                                Player is stopped. Click Play to start.
                            </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
