"use client";
import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './musicplayer.module.scss';
import { AppContext } from '@/app/layout';

interface Music {
    id_music: string;
    name: string;
    slug: string;
    url_cover: string;
    url_path: string;
}

const MusicPlayer: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const [music, setMusic] = useState<Music>(state.currentPlaylist[0]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { currentPlaylist, volume, isPlaying } = state;

    useEffect(() => {
        if (currentPlaylist && currentPlaylist.length > 0) {
            setMusic(currentPlaylist[0]);
        }
    }, [currentPlaylist]);

    useEffect(() => {
        const loadAndPlayAudio = async () => {
            if (audioRef.current) {
                try {
                    audioRef.current.load();
                    if (isPlaying) {  
                        await audioRef.current.play();
                    }
                } catch (error) {
                    console.error("Error playing audio:", error);
                }
            }
        };

        loadAndPlayAudio();
    }, [music?.url_path, isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handlePlayPause = () => {
        dispatch({
            type: "IS_PLAYING",
            payload: !isPlaying, 
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (
                audioRef.current &&
                audioRef.current.currentTime >= audioRef.current.duration &&
                currentPlaylist.length > 1
            ) {
                dispatch({
                    type: "CURRENT_PLAYLIST",
                    payload: currentPlaylist.slice(1)
                });
                dispatch({
                    type: "IS_PLAYING",
                    payload: true
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentPlaylist]);

    return (
        <div className={styles.musicPlayer}>
            {music && music.name}
            <audio ref={audioRef} src={music?.url_path} controls></audio>
            <button onClick={handlePlayPause}>
                {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
            </button>
            <input
                max={1}
                min={0}
                step={0.01}
                type="range"
                value={volume}
                onChange={(e) => dispatch({ type: "VOLUME", payload: parseFloat(e.target.value) })}
            />
        </div>
    );
};

export default MusicPlayer;
