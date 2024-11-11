import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import style from "./listmusictop.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";

interface Album {
  id_music: number;
  name: string;
  url_cover: string;
  artist: string;
  created_at: string;
  composer: string;
  url_path: string;
}

const ListMusicTop: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    axios
      .get("/music")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          setAlbums(response.result.data.slice(15, 60));
        } else {
          console.error("Response result.data is undefined or null:", response);
          setAlbums([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch album:", error);
        setAlbums([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, albums.length - 3);
      return prevIndex + 1 > maxIndex ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, albums.length - 3);
      return prevIndex - 1 < 0 ? maxIndex : prevIndex - 1;
    });
  };

  return (
    <>
      <div className={style.headerSection}>
        <h2>Top bài hát</h2>
        <div className={style.all}>
          <a href="#" className={style.viewAllButton}>
            Tất cả
          </a>
          <ReactSVG className={style.csvg} src="/all.svg" />
        </div>
      </div>

      <div className={style.sliderContainer}>
        <button onClick={prevSlide} className={style.leftArrow}>
          <ReactSVG src="/back-arrow.svg" />
        </button>

        <div className={style.albumList}>
          {isLoading ? (
            <div style={{ color: "white" }}>Đang tải...</div>
          ) : (
            albums.slice(currentIndex, currentIndex + 3).map((album, index) => (
              <div className={style.songCard} key={album.id_music}>
                <h1 className={style.rank}>{`#${currentIndex + index + 1}`}</h1>
                <div className={style.albumCoverWrapper}>
                  <img
                    src={album.url_cover}
                    alt={album.name}
                    className={style.albumCover}
                  />
                  <div className={style.playButton}>
                    <ReactSVG src="/play.svg" />
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
              </div>
            ))
          )}
        </div>

        <button onClick={nextSlide} className={style.rightArrow}>
          <ReactSVG src="/next-arrow.svg" />
        </button>
      </div>
    </>
  );
};

export default ListMusicTop;
