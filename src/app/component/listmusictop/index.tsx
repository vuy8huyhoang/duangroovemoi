import React, { useState, useEffect, useContext } from "react";
import axios from "@/lib/axios";
import style from "./listmusictop.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import { addMusicToTheFirst } from "../musicplayer";
import { AppContext } from "@/app/layout";

interface Album {
  id_music: string;
  name: string;
  url_cover: string;
  artist: string;
  created_at: string;
  composer: string;
  url_path: string;
  artists: any[
  ]
}

interface MusicHistory {
  id_music: string;
  created_at: string;
}


const ListMusicTop: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { state, dispatch } = useContext(AppContext);
  const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);

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
