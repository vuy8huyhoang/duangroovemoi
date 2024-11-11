import React, { useState, useEffect, useRef } from "react";
import axios from "@/lib/axios";
import style from "./listmusicType.module.scss";
import Link from "next/link";

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
}

const ListMusic: React.FC = () => {
  const [albums, setAlbums] = useState<Mussic[]>([]);
  const [currentSong, setCurrentSong] = useState<Mussic | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hoveredSong, setHoveredSong] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url_path;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  const handlePlayPause = (album: Mussic) => {
    if (currentSong?.id_music === album.id_music && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setCurrentSong(album);
      setIsPlaying(true);
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
            className={`${style.filter} ${
              activeFilter === filter ? style.active : ""
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
                  onClick={() => handlePlayPause(album)}
                >
                  {album.id_music === currentSong?.id_music && isPlaying ? (
                    <i className="fas fa-pause"></i>
                  ) : hoveredSong === album.id_music ? (
                    <i className="fas fa-play"></i>
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
