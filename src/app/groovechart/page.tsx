"use client";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "@/lib/axios";
import styles from "./style.module.scss";
import { ReactSVG } from "react-svg";
import Bxh from "../component/bxh";
import ListType from "../component/listtype";
import ListAlbum from "../component/listalbum";
import ListMusic from "../component/listmusic";
import ListMusicTop from "../component/listmusictop";
import AlbumHot from "../component/albumhot";
import { addMusicToTheFirst } from "../component/musicplayer";
import { AppContext } from "../layout";
import Link from "next/link";


interface MusicHistory {
  id_music: string;
  created_at: string;
}

interface Music {
  id_music: string;
  name: string;
  url_cover: string;
  composer: string;
  types: {
    name: string;
  }[];
  url_path: string;
  artists: any[];
  vỉew: number;
  artits:{
    id_artist: string;
    name: string;
    url_cover: string;
    created_at: string;
    last_update: string;
    is_show: string;
    followers: string;
  }
}

export default function GrooveChartPage() {
  const [musicData, setMusicData] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { state, dispatch } = useContext(AppContext);
  const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        axios.get("music").then((res: any) => {
          console.log(res);
          setMusicData(res.result.data);
        });
      } catch (error) {
        console.error("Lỗi fetch music", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMusicData();
  }, []);

  const playSong = (music: Music) => {
    if (audioRef.current) {
      if (currentSong?.id_music === music.id_music && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setCurrentSong(music);
        audioRef.current.src = music.url_path;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };
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
    <div className={styles.contentwrapper}>
      <h1 className={styles.title}>BẢNG XẾP HẠNG</h1>
      <div className={styles.musicList}>
        {musicData
          .sort((a, b) => b.vỉew - a.vỉew)
          .map((music, index) => (
            <div
              key={music.id_music}
              className={`${styles.songCard} ${
                hoveredSong === music.id_music ? styles.hovered : ""
              }`}
              onMouseEnter={() => setHoveredSong(music.id_music)}
              onMouseLeave={() => setHoveredSong(null)}
            >
              <span className={styles.index}>{index + 1}.</span>
              <div className={styles.image}>
                <img
                  src={music.url_cover}
                  alt={music.name}
                  className={styles.musicCover}
                />
                <div className={styles.overlay}>
                <button
    className={styles.playButton}
    onClick={async () => {
        // Thêm nhạc vào playlist và phát nhạc
        addMusicToTheFirst(
            state,
            dispatch,
            music.id_music.toString(),
            music.name,
            music.url_path,
            music.url_cover,
            music.composer,
            music.artists.map((artist) => artist.artist)
        );

        // Thêm vào lịch sử nghe nhạc
        addMusicToHistory(music.id_music.toString(), 100);

        // Dừng nhạc nếu đang phát và chọn lại nhạc
        if (
          music.id_music === state.currentPlaylist[0]?.id_music &&
            state.isPlaying
        ) {
            dispatch({ type: "IS_PLAYING", payload: false });
        }
    }}
>
    {music.id_music === state.currentPlaylist[0]?.id_music && state.isPlaying ? (
        <i className="fas fa-pause"></i>
    ) : (
        <i className="fas fa-play"></i>
    )}
</button>

                </div>
              </div>
             
              <div className={styles.Titles}>
                <Link href={`/musicdetail/${music.id_music}`}>
                <h5 className={styles.musicName}>{music.name}</h5>
                </Link>
                
                
                <p className={styles.musicViews}>Lượt xem: {music.vỉew}</p> 
                <p className={styles.musicArtist}>{music.composer}</p>
              </div>
            
              <div className={styles.songControls}>
                <i className="fas fa-heart"></i>
              </div>
              <div className={styles.moreOptions}>...</div>
            </div>
          ))}
      </div>
      <audio ref={audioRef} />
      <ListMusicTop />
      <ListType />
    </div>
  );
}
