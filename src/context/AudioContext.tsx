import React, { createContext, useContext, useState, useRef } from 'react';

interface AudioContextType {
    currentSong: Music | null;
    isPlaying: boolean;
    playSong: (music: Music) => void;
    audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<Music | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    const playSong = (music: Music) => {
        if (audioRef.current) {
            if (currentSong?.id_music === music.id_music && isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                setCurrentSong(music);
                audioRef.current.src = music.url_audio;
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <AudioContext.Provider value={{ currentSong, isPlaying, playSong, audioRef }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}; 