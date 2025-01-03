"use client";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "@/lib/axios";
import styles from "./style.module.scss";
import { ReactSVG } from "react-svg";
import Bxh from "../../component/bxh";
import ListType from "../../component/home/listtype";
import ListAlbum from "../../component/home/listalbum";
import ListMusic from "../../component/home/listmusic";
import ListMusicTop from "../../component/home/listmusictop";
import AlbumHot from "../../component/home/albumhot";
import { addMusicToTheFirst } from "../../component/musicplayer";
import { AppContext } from "../../layout";
import Link from "next/link";
import { Img } from "react-image";
import clsx from "clsx";

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
  view: number;
  artits: {
    id_artist: string;
    name: string;
    url_cover: string;
    created_at: string;
    last_update: string;
    is_show: string;
    followers: string;
  };
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
          // console.log(res);
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

  const handleHeartClick = (id_music) => {
    if (state?.profile) {
      if (state?.favoriteMusic.find((item) => item.id === id_music)) {
        axios
          .delete(`favorite-music/me?id_music=${id_music}`)
          .then((response: any) => {
            // console.log("Xóa bài hát yêu thích thành công", response);

            // Cập nhật state bằng cách loại bỏ id_music khỏi mảng
            dispatch({
              type: "FAVORITE_MUSIC",
              payload: state.favoriteMusic.filter(
                (music) => music.id_music !== id_music
              ),
            });
          })
          .catch((error: any) => {
            console.error("Error unliking album", error);
          });
      } else {
        axios
          .post(`favorite-music/me`, { id_music })
          .then((response: any) => {
            // console.log("Thêm bài hát yêu thích thành công", response);
            // setHeart(true);

            // Cập nhật state bằng cách thêm { id_music } vào mảng
            dispatch({
              type: "FAVORITE_MUSIC",
              payload: [...state.favoriteMusic, { id_music }],
            });
          })
          .catch((error: any) => {
            console.error("Error liking album", error);
          });
      }
    } else {
      dispatch({ type: "SHOW_LOGIN", payload: true });
    }
  };

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

  return (
    <div className={styles.contentwrapper}>
      <h1 className={styles.title}>BẢNG XẾP HẠNG</h1>
      <div className={styles.musicList}>
        {musicData
          .sort((a, b) => b.view - a.view)
          .slice(0, 50)
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
                {/* <img
                  src={music.url_cover}
                  alt={music.name}
                  className={styles.musicCover}
                /> */}
                <Img
                  src={music.url_cover} // URL ảnh từ album
                  alt={music.name}
                  // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                  className={styles.musicCover}
                  unloader={
                    <img
                      className={styles.musicCover}
                      src="/default.png"
                      alt="default"
                      // className={clsx(
                      //   style.albumCover,
                      //   style.albumCover__default
                      // )}
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

                      // Dừng nhạc nếu đang phát và chọn lại nhạc
                      if (
                        music.id_music ===
                          state?.currentPlaylist[0]?.id_music &&
                        state?.isPlaying
                      ) {
                        dispatch({ type: "IS_PLAYING", payload: false });
                      }
                    }}
                  >
                    {music.id_music === state?.currentPlaylist[0]?.id_music &&
                    state?.isPlaying ? (
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

                <p
                  className={clsx(
                    styles.musicViews,
                    "row-span-2 flex items-center"
                  )}
                >
                  Lượt xem: {music.view || 0}
                </p>
                <p className={styles.musicArtist}>{music.composer}</p>
              </div>

              <button
                className={styles.songControls}
                onClick={() => handleHeartClick(music.id_music)}
              >
                <i
                  className={clsx("fas fa-heart", {
                    [styles.active]: state?.favoriteMusic
                      .map((item) => item.id_music)
                      .includes(music.id_music),
                  })}
                ></i>
              </button>
              {/* <div className={styles.moreOptions}>...</div> */}
            </div>
          ))}
      </div>
      <audio ref={audioRef} />
      {/* <ListMusicTop /> */}
      {/* <ListType /> */}
    </div>
  );
}
