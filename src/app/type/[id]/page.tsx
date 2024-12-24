"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "@/lib/axios";
import styles from "./ct.module.scss";
import TypeCmt from "../typecmt";
import { addMusicToTheFirst } from "@/app/component/musicplayer";
import { AppContext } from "@/app/layout";
import { Img } from "react-image";

interface Music {
  id_music: number;
  name: string;
  url_cover: string;
  url_path: string;
  artist: string;
  genre: string;
  release: string;
  composer: string;
  artists: any[];
}

interface MusicHistory {
  id_music: string;
  created_at: string;
}

const TypeDetailPage = ({ params }) => {
  const idType = params.id;
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
  const { state, dispatch } = useContext(AppContext);
  const [currentType, setCurrentType] = useState("Tất cả");

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

  const addMusicToHistory = async (id_music: string, play_duration: number) => {
    try {
      const response: any = await axios.post("/music-history/me", {
        id_music,
        play_duration,
      });
      const newHistory: MusicHistory = response.result;
      setMusicHistory((prevHistory) => [newHistory, ...prevHistory]);
      // console.log("Added to history:", newHistory);
    } catch (error) {
      console.error("Error adding to music history:", error);
    }
  };

  useEffect(() => {
    if (idType) {
      fetchMusicList();
    }
    if (idType) {
      axios.get(`type?id_type=${idType}`).then((res: any) => {
        setCurrentType(res.result.data[0].name);
      });
    }
  }, [idType]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div>
        <h1 className={styles.title}>Danh sách nhạc thể loại: {currentType}</h1>
        <div className={styles.albumList}>
          {Array.isArray(musicList) && musicList.length > 0 ? (
            musicList.map((music) => (
              <div key={music.id_music} className={styles.songCard}>
                <div className={styles.albumCoverWrapper}>
                  <Img
                    src={music.url_cover} // URL ảnh từ album
                    alt={music.name}
                    className={styles.albumCover}
                    // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                    unloader={
                      <img
                        src="/default.png"
                        alt="default"
                        className={styles.albumCover}
                      />
                    } // Thay thế ảnh khi lỗi
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
                        if (
                          music.id_music ===
                            state.currentPlaylist[0]?.id_music &&
                          state.isPlaying
                        ) {
                          dispatch({ type: "IS_PLAYING", payload: false });
                        }
                      }}
                    >
                      {music.id_music === state.currentPlaylist[0]?.id_music &&
                      state.isPlaying ? (
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

        {/* <audio ref={audioRef}></audio> */}
      </div>
      <TypeCmt />
    </>
  );
};

export default TypeDetailPage;
