"use client"
import React, { useContext, useEffect, useState } from "react";
import styles from "./rightsidebar.module.scss";
import { AppContext } from "@/app/layout";
import {  addMusicToTheFirst } from "../musicplayer";
import Link from "next/link";

export default function RightSidebar() {
    const { state, dispatch } = useContext(AppContext);
    const [playlist, setPlaylist] = useState<any[]>([]);
    useEffect(() => {
        setPlaylist(state?.currentPlaylist);
    }, [state?.currentPlaylist]);
    const handleChangeMusic = (index:number):any => {
        addMusicToTheFirst(
            state,
            dispatch,
            state?.currentPlaylist?.[index+1]?.id_music as any,
            state?.currentPlaylist?.[index+1]?.name,
            state?.currentPlaylist?.[index+1]?.url_path,
            state?.currentPlaylist?.[index+1]?.url_cover,
            state?.currentPlaylist?.[index+1]?.composer,
            state?.currentPlaylist?.[index+1]?.artists.map(artist => artist.artist)
        );
        
            dispatch({
                type: "IS_PLAYING",
                payload: true
            })
                
        }

    return (
       
        <div className={styles.rightSidebar}>
            <div className={styles.all_header}>
            <div className={styles.header}>
                <button className={styles.active}>Danh sách phát</button>
                <button>Nghe gần đây</button>
            </div>
            <div className={styles.header}>
               
                <button className={styles.moreBtn}>...</button>
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
                                        onClick={() => {
                                            handleChangeMusic(index)
                                        }
                                        }
                                    >
            
                                        <i className="fas fa-play"></i>       
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
                                <div className={styles.moreOptions}>...</div>
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
