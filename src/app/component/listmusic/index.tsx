"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "@/lib/axios";
import style from "./listmusic.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addMusicToTheFirst } from "../musicplayer";
import { AppContext } from "@/app/layout";

interface Mussic {
    id_music: number;
    name: string;
    url_cover: string;
    url_path: string;
    composer: string;
    artists: any[];
    genre: string;
}

interface MusicHistory {
    id_music: string;
    created_at: string;
}

interface Playlist {
    id_playlist: string;
    name: string;
    index_order: number;
}

const ListMusic: React.FC = () => {
    const [albums, setAlbums] = useState<Mussic[]>([]);
    const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
    const [favoriteMusic, setFavoriteMusic] = useState<Set<number>>(new Set());
    const [menuVisible, setMenuVisible] = useState<number | null>(null);
    const [submenuVisible, setSubmenuVisible] = useState<number | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const { state, dispatch } = useContext(AppContext);

    const router = useRouter();

    useEffect(() => {
        axios
            .get("/music")
            .then((response: any) => {
                if (response?.result?.data) {
                    setAlbums(response.result.data.slice(0, 6));
                }
            })
            .catch((error: any) => console.error("Error fetching albums:", error));

        axios
            .get("/music-history/me")
            .then((response: any) => setMusicHistory(response.result.data))
            .catch((error: any) => console.error("Error fetching music history:", error));

        axios
            .get("/playlist/me")
            .then((response: any) => setPlaylists(response.result.data))
            .catch((error: any) => console.error("Error fetching playlists:", error));
    }, []);

    const addMusicToHistory = async (id_music: string, play_duration: number = 100) => {
        try {
            const response: any = await axios.post("/music-history/me", { id_music, play_duration });
            const newHistory: MusicHistory = response.result;
            setMusicHistory((prevHistory) => [newHistory, ...prevHistory]);
            console.log("Added to history:", newHistory);
        } catch (error) {
            console.error("Error adding to music history:", error);
        }
    };

    const toggleFavorite = async (id_music: number) => {
        const isFavorite = favoriteMusic.has(id_music);
        setFavoriteMusic((prev) => {
            const updated = new Set(prev);
            if (isFavorite) {
                updated.delete(id_music);
            } else {
                updated.add(id_music);
            }
            return updated;
        });

        try {
            if (isFavorite) {
                await axios.delete("/favorite-music/me", { data: { id_music } });
            } else {
                await axios.post("/favorite-music/me", { id_music });
            }
        } catch (error) {
            console.error("Error updating favorite music:", error);
        }
    };

    return (
        <div className={style.albumList}>
            {albums.map((album) => (
                <div key={album.id_music} className={style.songCard}>
                    <div className={style.albumCoverWrapper}>
                        <img src={album.url_cover} alt={album.name} className={style.albumCover} />
                        <div className={style.overlay}>
                            <button
                                className={style.playButton}
                                onClick={async () => {
                                    addMusicToTheFirst(
                                        state,
                                        dispatch,
                                        album.id_music.toString(),
                                        album.name,
                                        album.url_path,
                                        album.url_cover,
                                        album.composer,
                                        album.artists.map((artist) => artist.artist)
                                    );

                                    await addMusicToHistory(album.id_music.toString(), 100);

                                    if (
                                        album.id_music === state.currentPlaylist[0]?.id_music &&
                                        state.isPlaying
                                    ) {
                                        dispatch({ type: "IS_PLAYING", payload: false });
                                    }
                                }}
                            >
                                {album.id_music === state.currentPlaylist[0]?.id_music && state.isPlaying ? (
                                    <i className="fas fa-pause"></i>
                                ) : (
                                    <i className="fas fa-play"></i>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className={style.songInfo}>
                        <div className={style.songName}>
                            <Link href={`/musicdetail/${album.id_music}`}>{album.name}</Link>
                        </div>
                        <div className={style.composerName}>
                            <Link href={`/musicdetail/${album.id_music}`}>{album.composer}</Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListMusic;
