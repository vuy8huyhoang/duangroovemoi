import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "@/lib/axios";
import style from "./listmusicType.module.scss";
import Link from "next/link";
import { addMusicToTheFirst } from "../musicplayer";
import { AppContext } from "@/app/layout";

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
          setAlbums(response.result.data);
        }
      })
      .catch((error: any) => console.error("Error fetching albums:", error));
  }, []);

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

  const handleFilterClick = (filter: string) => setActiveFilter(filter);

  const filteredAlbums =
    activeFilter === "Tất cả"
      ? albums
      : albums.filter((album) => album.genre === activeFilter);

  const paginatedAlbums = filteredAlbums.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalItems = filteredAlbums.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <div className={style.headerSection}>
        <h2>Mới phát hành</h2>
      </div>

      <div className={style.filterBar}>
        {["Tất cả"].map((filter) => (
          <button
            key={filter}
            className={`${style.filter} ${activeFilter === filter ? style.active : ""
              }`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className={style.albumList}>
        {paginatedAlbums.map((album) => (
          <div
            key={album.id_music}
            className={style.songCard}
            onMouseEnter={() => setHoveredSong(album.id_music)}
            onMouseLeave={() => setHoveredSong(null)}
          >
            <div className={style.albumCoverWrapper}>
              <img
                src={album.url_cover}
                alt={album.name}
                className={style.albumCover}
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
                    await addMusicToHistory(album.id_music.toString(), 100);

                    // Dừng nhạc nếu đang phát và chọn lại nhạc
                    if (
                      album.id_music === state.currentPlaylist[0]?.id_music &&
                      state.isPlaying
                    ) {
                      dispatch({ type: "IS_PLAYING", payload: false });
                    }
                  }}
                >
                  {album.id_music === state.currentPlaylist[0]?.id_music && state.isPlaying ? (
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
          Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Sau
        </button>
      </div>

      <audio ref={audioRef}></audio>
    </>
  );
};

export default ListMusic;
