"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";
import styles from "./ct.module.scss";
import TypeCmt from "../../component/typecmt";

interface Music {
  id_music: number;
  name: string;
  url_cover: string;
  url_path: string;
  artist: string;
  genre: string;
  release: string;
  composer: string;
}

const TypeDetailPage = ({ params }) => {
  const idType = params.id;
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchMusicList = async () => {
    try {
      const response: any = await axios.get(`/music?id_type=${idType}`);
      setMusicList(response.result.data || []);
    } catch (err) {
      console.error("Error fetching music list:", err);
      setError("Có lỗi xảy ra khi tải danh sách nhạc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idType) {
      fetchMusicList();
    }
  }, [idType]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url_path;
      audioRef.current.play();
      setIsPlaying(true);
    }

    return () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    };
  }, [currentSong]);

  const handlePlayPause = (music: Music) => {
    if (currentSong?.id_music === music.id_music && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setCurrentSong(music);
      setIsPlaying(true);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div>
        <h1 className={styles.title}>Danh Sách Nhạc Thể Loại: {idType}</h1>
        <div className={styles.albumList}>
          {Array.isArray(musicList) && musicList.length > 0 ? (
            musicList.map((music) => (
              <div key={music.id_music} className={styles.songCard}>
                <div className={styles.albumCoverWrapper}>
                  <img
                    src={music.url_cover}
                    alt={music.name}
                    className={styles.albumCover}
                  />
                  <div className={styles.overlay}>
                    <button
                      className={styles.playButton}
                      onClick={() => handlePlayPause(music)}
                    >
                      {currentSong?.id_music === music.id_music && isPlaying ? (
                        <i className="fas fa-pause"></i>
                      ) : (
                        <i className="fas fa-play"></i>
                      )}
                    </button>
                  </div>
                </div>
                <div className={styles.songInfo}>
                  <div className={styles.songName}>
                    <a href={`/musicdetail/${music.id_music}`}>{music.name}</a>
                  </div>
                  <div className={styles.composerName}>
                    <a href={`/musicdetail/${music.id_music}`}>
                      {music.composer}
                    </a>
                  </div>
                </div>
                <div className={styles.songControls}>
                  <i className="fas fa-heart"></i>
                  <i className="fas fa-ellipsis-h"></i>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.textloi}>
              Không có nhạc nào trong thể loại này.
            </div>
          )}
        </div>

        <audio ref={audioRef}></audio>
      </div>
      <TypeCmt />
    </>
  );
};

export default TypeDetailPage;
