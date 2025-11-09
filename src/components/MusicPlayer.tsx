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
            } catch (e) {
                console.debug('autoplay attempt failed', e);
            }
        }
    }, []);

    return (
        <div className="fixed right-4 bottom-4 z-50 w-80">
            <div className="bg-white rounded-lg shadow p-2 flex flex-col">
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm font-medium">Resumay Tailor Swift — Player</div>
                    <div className="flex items-center gap-2">
                        <button
                            aria-label={isPlaying ? 'Pause music' : 'Play music'}
                            onClick={() => setIsPlaying((s) => !s)}
                            className="px-3 py-1 rounded bg-primary-600 text-white text-sm"
                        >
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                    </div>
                </div>

                <div className="mt-2">
                    {src ? (
                        <iframe
                            data-testid="embed-iframe"
                            className="rounded-md"
                            src={src}
                            width="100%"
                            height="80"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            title="Tailor Swift playlist"
                        />
                    ) : (
                        <div className="text-xs text-gray-500 px-2 py-6">Player is stopped. Click Play to start.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
