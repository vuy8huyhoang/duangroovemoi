import React from "react";
import styles from "./rightsidebar.module.scss";

export default function RightSidebar() {
    const playlist = [
        { title: "Người Ấy", artist: "Trịnh Thăng Bình", isPlaying: true, image: "https://danviet.mediacdn.vn/296231569849192448/2023/10/14/son-tung-mtp-1697273184168953378334.jpg" },
        { title: "Nếu Em Cần", artist: "Trịnh Thăng Bình", image: "https://danviet.mediacdn.vn/296231569849192448/2023/10/14/son-tung-mtp-1697273184168953378334.jpg" },
        { title: "Khác Biệt To Lớn", artist: "Trịnh Thăng Bình, Liz Kim Cương", image: "https://danviet.mediacdn.vn/296231569849192448/2023/10/14/son-tung-mtp-1697273184168953378334.jpg" },
        { title: "Khác Biệt To Lớn Hơn", artist: "Trịnh Thăng Bình, Liz Kim Cương", image: "https://danviet.mediacdn.vn/296231569849192448/2023/10/14/son-tung-mtp-1697273184168953378334.jpg" },
        { title: "Tâm Sự Tuổi 30", artist: "Trịnh Thăng Bình", image: "https://danviet.mediacdn.vn/296231569849192448/2023/10/14/son-tung-mtp-1697273184168953378334.jpg" },
    ];

    return (
        <div className={styles.rightSidebar}>
            <div className={styles.header}>
                <button>Danh sách phát</button>
                <button>Nghe gần đây</button>
                <button className={styles.moreBtn}>...</button>
            </div>
            <div className={styles.new}>
                    <div className={styles.thumbnail}>
                        <img className={styles.hinh} src={playlist[0].image} alt={playlist[0].title} />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.title}>{playlist[0].title}</div>
                        <div className={styles.artist}>{playlist[0].artist}</div>
                    </div>
            </div>
            <div className={styles.list}>
                <div className={styles.titleSection}>Tiếp theo</div>
                {playlist.slice(1).map((song, index) => (
                    <div key={index} className={styles.song}>
                        <div className={styles.thumbnail}>
                            <img className={styles.hinh} src={song.image} alt={song.title} />
                        </div>
                        <div className={styles.info}>
                            <div className={styles.title}>{song.title}</div>
                            <div className={styles.artist}>{song.artist}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
