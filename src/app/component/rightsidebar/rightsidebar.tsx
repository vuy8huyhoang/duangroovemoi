"use client"
import React, { useContext, useEffect, useState } from "react";
import styles from "./rightsidebar.module.scss";
import { AppContext } from "@/app/layout";
import { addMusicToTheFirst } from "../musicplayer";
import Link from "next/link";
import axios from "@/lib/axios";



interface MusicHistory {
    id_music: string;
    created_at: string;
}

export default function RightSidebar() {
    const { state, dispatch } = useContext(AppContext);
    const [playlist, setPlaylist] = useState<any[]>([]);
    const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };
    const deletePlaylist = () => {
        dispatch({ type: "CURRENT_PLAYLIST", payload: [] });
        // closeDropdown();
    }
    const deleteMusic = (index: number) => {

        dispatch({ type: "CURRENT_PLAYLIST", payload: state.currentPlaylist.filter((_, idx) => idx !== index) });
        closeDropdown();
    }

    const swapMusic = (currentIndex: number, newIndex: number) => {
        const currentList = [...state.currentPlaylist]; // Tạo một bản sao của danh sách hiện tại để tránh thay đổi trực tiếp mảng ban đầu
        const temp = currentList[currentIndex];
        currentList[currentIndex] = currentList[newIndex];
        currentList[newIndex] = temp;

        dispatch({
            type: "CURRENT_PLAYLIST",
            payload: currentList
        });

        closeDropdown();
    }

    useEffect(() => {
        setPlaylist(state?.currentPlaylist);
    }, [state?.currentPlaylist]);
    const handleChangeMusic = (index: number): any => {
        addMusicToTheFirst(
            state,
            dispatch,
            state?.currentPlaylist?.[index + 1]?.id_music as any,
            state?.currentPlaylist?.[index + 1]?.name,
            state?.currentPlaylist?.[index + 1]?.url_path,
            state?.currentPlaylist?.[index + 1]?.url_cover,
            state?.currentPlaylist?.[index + 1]?.composer,
            state?.currentPlaylist?.[index + 1]?.artists.map(artist => artist.artist)
        );

        dispatch({
            type: "IS_PLAYING",
            payload: true
        })

    }
    const addMusicToHistory = async (id_music: string, play_duration: number) => {
        try {
            const response: any = await axios.post("/music-history/me", { id_music, play_duration });
            const newHistory: MusicHistory = response.result;
            setMusicHistory((prevHistory) => [newHistory, ...prevHistory]);
            console.log("Added to history:", newHistory);
        } catch (error) {
            console.error("Error adding to music history:", error);
        }
    };


    return (

        <div className={styles.rightSidebar}>
            <div className={styles.all_header}>
                <div className={styles.header}>
                    <button className={styles.active}>Danh sách phát</button>
                    <Link href={`/historymusic`}><button>Nghe gần đây</button></Link>

                </div>
                <div className={styles.header}>

                    <button className={styles.moreBtn} onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown();
                    }}>...</button>
                    {isDropdownOpen && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownItem} onClick={(e) => {
                                deletePlaylist();
                            }}>Xóa danh sách phát</div>
                            <div className={styles.dropdownItem}>Thêm vào playlist</div>
                        </div>
                    )}
                </div>
            </div>
            {playlist?.length > 0 && (
                <>
                    <div className={styles.new}>
                        <div className={styles.thumbnail}>

                            <img
                                className={styles.hinh}
                                src={playlist?.[0].url_cover}
                                alt={playlist?.[0].name}
                            />
                            <button
                                className={styles.playButton}
                                onClick={() => {
                                    dispatch({
                                        type: "IS_PLAYING",
                                        payload: !state?.isPlaying
                                    });
                                }
                                }
                            >
                                {state.isPlaying ? (
                                    <i className="fas fa-pause"></i>
                                ) : (
                                    <i className="fas fa-play"></i>
                                )}
                            </button>
                        </div>
                        <div className={styles.info}>
                            <Link href={`/musicdetail/${playlist?.[0].id_music}`}>

                                <div className={styles.title}>{playlist?.[0].name}</div>
                                <div className={styles.artist}>{playlist?.[0].composer}</div>
                            </Link>

                            <audio controls src={playlist?.[0].url_path} className={styles.audio}>
                            </audio>
                        </div>
                        <div className={styles.songControls}>
                            <i className="fas fa-heart"></i>
                        </div>
                        <div className={styles.moreOptions}>...</div>
                    </div>

                    <div className={styles.list}>
                        <div className={styles.titleSection}>Tiếp theo</div>
                        {playlist.slice(1).map((song, index) => (
                            <div key={song.id_music} className={styles.song}>

                                <div className={styles.thumbnail}>
                                    <img
                                        className={styles.hinh}
                                        src={song.url_cover}
                                        alt={song.name}
                                    />
                                    <button
                                        className={styles.playButton}
                                        onClick={async () => {
                                            // Thêm nhạc vào playlist và phát nhạc
                                            addMusicToTheFirst(
                                                state,
                                                dispatch,
                                                song.id_music.toString(),
                                                song.name,
                                                song.url_path,
                                                song.url_cover,
                                                song.composer,
                                                song.artists.map((artist) => artist.artist)
                                            );

                                            // Thêm vào lịch sử nghe nhạc
                                            await addMusicToHistory(song.id_music.toString(), 100);

                                            // Dừng nhạc nếu đang phát và chọn lại nhạc
                                            if (
                                                song.id_music === state.currentPlaylist[0]?.id_music &&
                                                state.isPlaying
                                            ) {
                                                dispatch({ type: "IS_PLAYING", payload: false });
                                            }
                                        }}
                                    >
                                        {song.id_music === state.currentPlaylist[0]?.id_music && state.isPlaying ? (
                                            <i className="fas fa-pause"></i>
                                        ) : (
                                            <i className="fas fa-play"></i>
                                        )}
                                    </button>

                                </div>
                                <div className={styles.info}>
                                    <Link href={`/musicdetail/${song.id_music}`}>

                                        <div className={styles.title}>{song.name}</div>
                                        <div className={styles.artist}>
                                            {song.composer}
                                        </div>
                                    </Link>

                                    <audio controls src={song.url_path} className={styles.audio}>
                                    </audio>
                                </div>
                                <div className={styles.songControls}>
                                    <i className="fas fa-heart"></i>
                                </div>
                                <div className={styles.moreOptions} onClick={(e) => {
                                    
                                }}>...</div>
                               
                            
                            </div>
                        ))}
                    </div>
                </>
            )}

            {playlist.length === 0 && (
                <div className={styles.empty}>
                    <p>Chưa có danh sách phát nào.</p>
                </div>
            )}
        </div>
    );
}
