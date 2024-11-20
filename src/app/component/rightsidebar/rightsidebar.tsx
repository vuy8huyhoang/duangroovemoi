import React, { useContext, useEffect, useState } from "react";
import styles from "./rightsidebar.module.scss";
import { AppContext } from "@/app/layout";

export default function RightSidebar() {
    const { state, dispatch } = useContext(AppContext);
    const [playlist, setPlaylist] = useState<any[]>([]);
    useEffect(() => {
        setPlaylist(state?.currentPlaylist);
    }, [state?.currentPlaylist]);
    

    return (
        <div className={styles.rightSidebar}>
            <div className={styles.header}>
                <button>Danh sách phát</button>
                <button>Nghe gần đây</button>
                <button className={styles.moreBtn}>...</button>
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
                            >
                                ▶
                            </button>
                        </div>
                        <div className={styles.info}>
                            <div className={styles.title}>{playlist?.[0].name}</div>
                            <div className={styles.artist}>Nhạc sĩ: {playlist?.[0].composer}</div>
                            <audio controls src={playlist?.[0].url_path} className={styles.audio}>
                            </audio>
                        </div>
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
                                        className={styles.playBtn}
                                    >
                                        ▶
                                    </button>
                                </div>
                                <div className={styles.info}>
                                    <div className={styles.title}>{song.name}</div>
                                    <div className={styles.artist}>
                                        Nhạc sĩ: {song.composer}
                                    </div>
                                    <audio controls src={song.url_path} className={styles.audio}>
                                    </audio>
                                </div>
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
