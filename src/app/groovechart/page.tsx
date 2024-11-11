"use client";
import { useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";
import styles from "./style.module.scss";
import { ReactSVG } from "react-svg";
import Bxh from "../component/bxh";
import ListType from "../component/listtype";
import ListAlbum from "../component/listalbum";
import ListMusic from "../component/listmusic";
import ListMusicTop from "../component/listmusictop";
import AlbumHot from "../component/albumhot";

interface Music {
  id_music: string;
  name: string;
  url_cover: string;
  composer: string;
  types: {
    name: string;
  }[];
  url_path: string;

  views: number;
}

export default function GrooveChartPage() {
  const [musicData, setMusicData] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <div className={styles.contentwrapper}>
      <h1 className={styles.title}>BẢNG XẾP HẠNG</h1>
      <div className={styles.musicList}>
        {musicData
          .sort((a, b) => b.views - a.views)
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
                    onClick={() => playSong(music)}
                  >
                    <i
                      className={`fas ${
                        currentSong?.id_music === music.id_music && isPlaying
                          ? "fa-pause"
                          : "fa-play"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
              <div className={styles.Titles}>
                <h5 className={styles.musicName}>{music.name}</h5>
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
