import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "@/lib/axios";
import style from "./listmusicType.module.scss";
import Link from "next/link";
import { addMusicToTheFirst } from "../musicplayer";
import { AppContext } from "@/app/layout";
import { Img } from "react-image";
import clsx from "clsx";
import { formatTimeFromNow } from "@/utils/String";

interface Mussic {
  id_music: number;
  name: string;
  url_cover: string;
  url_path: string;
  artist: string;
  genre: string;
  release: string;
  composer: string;
  music: string;
  musics: {
    id_music: string;
  };
  artists: any[];
  created_at: string;
}
interface MusicHistory {
  id_music: string;
  created_at: string;
}

const ListMusic: React.FC = () => {
  const [albums, setAlbums] = useState<Mussic[]>([]);
  const [currentSong, setCurrentSong] = useState<Mussic | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hoveredSong, setHoveredSong] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");
  const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    axios
      .get("/music")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          setAlbums(
            response.result.data.sort((a, b) => {
              const dateA = new Date(a.created_at).getTime() || 0;
              const dateB = new Date(b.created_at).getTime() || 0;
              return dateB - dateA;
            })
          );
        }
      })
      .catch((error: any) => console.error("Error fetching albums:", error));
  }, []);

  const addMusicToHistory = async (id_music: string, play_duration: number) => {
    try {
      const response: any = await axios.post("/music-history/me", {
        id_music,
        play_duration,
      });
      const newHistory: MusicHistory = response.result;
      setMusicHistory((prevHistory) => [newHistory, ...prevHistory]);
      console.log("Added to history:", newHistory);
    } catch (error) {
      console.error("Error adding to music history:", error);
    }
  };

  const handleFilterClick = (filter: string) => setActiveFilter(filter);

  const filteredAlbums =
    activeFilter === "Tất cả"
      ? albums
      : albums.filter((album) => album.genre === activeFilter);

  const phantrang = filteredAlbums.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalItems = filteredAlbums.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <div className={style.headerSection}>
        <h2 className="home__heading">Mới phát hành</h2>
      </div>

      {/* <div className={style.filterBar}>
        {["Tất cả"].map((filter) => (
          <button
            key={filter}
            className={`${style.filter} ${
              activeFilter === filter ? style.active : ""
            }`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </button>
        ))}
      </div> */}

      <div className={style.albumList}>
        {phantrang.map((album) => (
          <div
            key={album.id_music}
            className={style.songCard}
            onMouseEnter={() => setHoveredSong(album.id_music)}
            onMouseLeave={() => setHoveredSong(null)}
          >
            <div className={style.albumCoverWrapper}>
              <Img
                src={album.url_cover} // URL ảnh từ album
                alt={album.name}
                // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                className={style.albumCover}
                unloader={
                  <img
                    className={clsx(
                      style.albumCover,
                      "rounded-full overflow-hidden"
                    )}
                    src="/default.png"
                    alt="default"
                    // className={clsx(
                    //   style.albumCover,
                    //   style.albumCover__default
                    // )}
                  />
                } // Thay thế ảnh khi lỗi
              />
              <div className={style.overlay}>
                <button
                  className={style.playButton}
                  onClick={async () => {
                    // Thêm nhạc vào playlist và phát nhạc
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

                    // Thêm vào lịch sử nghe nhạc
                    addMusicToHistory(album.id_music.toString(), 100);

                    // Dừng nhạc nếu đang phát và chọn lại nhạc
                    if (
                      album.id_music === state?.currentPlaylist[0]?.id_music &&
                      state?.isPlaying
                    ) {
                      dispatch({ type: "IS_PLAYING", payload: false });
                    }
                  }}
                >
                  {album.id_music === state?.currentPlaylist[0]?.id_music &&
                  state?.isPlaying ? (
                    <i className="fas fa-pause"></i>
                  ) : (
                    <i className="fas fa-play"></i>
                  )}
                </button>
              </div>
            </div>
            <div className={style.songInfo}>
              <div className={style.songName}>
                <Link href={`/musicdetail/${album.id_music}`}>
                  {album.name}
                </Link>
              </div>
              <div className={style.composerName}>
                <Link href={`/musicdetail/${album.id_music}`}>
                  {album.composer}
                </Link>
              </div>
              <div className="text-[13px] text-gray-500">
                <Link href={`/musicdetail/${album.id_music}`}>
                  {formatTimeFromNow(album.created_at)}
                </Link>
              </div>
            </div>
            <div className={style.songControls}>
              <i className="fas fa-heart"></i>
              <i className="fas fa-ellipsis-h"></i>
            </div>
          </div>
        ))}
      </div>

      <div className={style.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      <audio ref={audioRef}></audio>
    </>
  );
};

export default ListMusic;
