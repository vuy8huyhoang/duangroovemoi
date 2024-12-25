"use client";
import React, { useContext, useEffect, useState } from "react";
import styles from "./rightsidebar.module.scss";
import { AppContext } from "@/app/layout";
import { addMusicToTheFirst } from "../musicplayer";
import Link from "next/link";
import axios from "@/lib/axios";
import { Img } from "react-image";
import clsx from "clsx";

interface MusicHistory {
  id_music: string;
  created_at: string;
}

export default function RightSidebar() {
  const { state, dispatch } = useContext(AppContext);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const deletePlaylist = () => {
    dispatch({ type: "CURRENT_PLAYLIST", payload: [] });
    // closeDropdown();
  };

  const deleteMusic = (index: number) => {
    dispatch({
      type: "CURRENT_PLAYLIST",
      payload: state?.currentPlaylist.filter((_, idx) => idx !== index),
    });
    closeDropdown();
  };

  const swapMusic = (currentIndex: number, newIndex: number) => {
    const currentList = [...state?.currentPlaylist]; // Tạo một bản sao của danh sách hiện tại để tránh thay đổi trực tiếp mảng ban đầu
    const temp = currentList[currentIndex];
    currentList[currentIndex] = currentList[newIndex];
    currentList[newIndex] = temp;

    dispatch({
      type: "CURRENT_PLAYLIST",
      payload: currentList,
    });

    closeDropdown();
  };

  const toggleFavorite = async (id_music: number) => {
    if (state?.profile) {
      // Kiểm tra xem id_music có trong danh sách yêu thích hay không
      const isAlreadyFavorite = state.favoriteMusic.some(
        (music) => music.id_music === id_music
      );

      // Cập nhật mảng favoriteMusic
      const updatedFavoriteMusic = isAlreadyFavorite
        ? state.favoriteMusic.filter((music) => music.id_music !== id_music)
        : [...state.favoriteMusic, { id_music }];

      // Dispatch mảng mới
      dispatch({
        type: "FAVORITE_MUSIC",
        payload: updatedFavoriteMusic,
      });

      try {
        if (isAlreadyFavorite) {
          // Nếu đã có trong danh sách, thực hiện xóa
          await axios.delete(`/favorite-music/me?id_music=${id_music}`);
          // alert("Xóa bài hát yêu thích thành công");
        } else {
          // Nếu chưa có trong danh sách, thực hiện thêm
          await axios.post("/favorite-music/me", { id_music });
          // alert("Thêm bài hát yêu thích thành công");
        }
      } catch (error) {
        console.error("Error updating favorite music:", error);
      }
    } else {
      // Nếu người dùng chưa đăng nhập, yêu cầu đăng nhập
      dispatch({ type: "SHOW_LOGIN", payload: true });
    }
  };

  useEffect(() => {
    setPlaylist(state?.currentPlaylist);
  }, [state?.currentPlaylist]);
  const handleChangeMusic = (index: number): any => {
    addMusicToTheFirst(
      state,
      dispatch,
      state?.currentPlaylist?.[index + 1]?.id_music as any,
      state?.currentPlaylist?.[index + 1]?.name,
      state?.currentPlaylist?.[index + 1]?.url_path,
      state?.currentPlaylist?.[index + 1]?.url_cover,
      state?.currentPlaylist?.[index + 1]?.composer,
      state?.currentPlaylist?.[index + 1]?.artists.map(
        (artist) => artist.artist
      )
    );

    dispatch({
      type: "IS_PLAYING",
      payload: true,
    });
  };
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
  console.log(state?.favoriteMusic);

  return (
    <div className={styles.rightSidebar}>
      <div className="flex justify-between mb-4">
        <button className="font-semibold text-[16px] uppercase text-gray-200">
          Đang phát
        </button>
        <button
          className="text-red-700 font-medium text-[12px]"
          onClick={deletePlaylist}
        >
          Xóa tất cả
        </button>
      </div>
      {playlist?.length > 0 && (
        <>
          <div className={styles.new}>
            <div className={styles.thumbnail}>
              {/* <img
                className={styles.hinh}
                src={playlist?.[0].url_cover}
                alt={playlist?.[0].name}
              /> */}
              <Img
                src={playlist?.[0].url_cover} // URL ảnh từ album
                alt={playlist?.[0].name}
                // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                className={styles.hinh}
                unloader={
                  <img
                    className={styles.hinh}
                    src="/default.png"
                    alt="default"
                    // className={clsx(
                    //   style.albumCover,
                    //   style.albumCover__default
                    // )}
                  />
                } // Thay thế ảnh khi lỗi
              />
              <button
                className={styles.playButton}
                onClick={() => {
                  dispatch({
                    type: "IS_PLAYING",
                    payload: !state?.isPlaying,
                  });
                }}
              >
                {state?.isPlaying ? (
                  <i className="fas fa-pause"></i>
                ) : (
                  <i className="fas fa-play"></i>
                )}
              </button>
            </div>
            <div className={styles.info}>
              <Link href={`/musicdetail/${playlist?.[0].id_music}`}>
                <div className={styles.title}>{playlist?.[0].name}</div>
                <div className={styles.artist}>{playlist?.[0].composer}</div>
              </Link>

              <audio
                controls
                src={playlist?.[0].url_path}
                className={styles.audio}
              ></audio>
            </div>
            <button
              className={clsx(styles.songControls, {
                [styles.active]: state?.favoriteMusic
                  .map((i) => i.id_music)
                  .includes(playlist?.[0].id_music),
              })}
              onClick={() => toggleFavorite(playlist?.[0].id_music)}
            >
              <i className="fas fa-heart"></i>
            </button>
            {/* <div className={styles.moreOptions}>...</div> */}
          </div>

          <div className={styles.list}>
            <div className="font-medium text-[14px] uppercase text-gray-500 mt-4">
              Tiếp theo
            </div>
            {playlist.slice(1).map((song, index) => (
              <div key={song.id_music} className={styles.song}>
                <div className={styles.thumbnail}>
                  <Img
                    src={song.url_cover} // URL ảnh từ album
                    alt=""
                    // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                    className={styles.hinh}
                    unloader={
                      <img
                        className={clsx(styles.hinh, "rounded-full")}
                        src="/default.png"
                        alt="default"
                        // className={clsx(
                        //   style.albumCover,
                        //   style.albumCover__default
                        // )}
                      />
                    } // Thay thế ảnh khi lỗi
                  />
                  <button
                    className={styles.playButton}
                    onClick={async () => {
                      // Thêm nhạc vào playlist và phát nhạc
                      addMusicToTheFirst(
                        state,
                        dispatch,
                        song.id_music.toString(),
                        song.name,
                        song.url_path,
                        song.url_cover,
                        song.composer,
                        song.artists.map((artist) => artist.artist)
                      );

                      // Thêm vào lịch sử nghe nhạc
                      addMusicToHistory(song.id_music.toString(), 100);

                      // Dừng nhạc nếu đang phát và chọn lại nhạc
                      if (
                        song.id_music === state?.currentPlaylist[0]?.id_music &&
                        state?.isPlaying
                      ) {
                        dispatch({ type: "IS_PLAYING", payload: false });
                      }
                    }}
                  >
                    {song.id_music === state?.currentPlaylist[0]?.id_music &&
                    state?.isPlaying ? (
                      <i className="fas fa-pause"></i>
                    ) : (
                      <i className="fas fa-play"></i>
                    )}
                  </button>
                </div>
                <div className={styles.info}>
                  <Link href={`/musicdetail/${song.id_music}`}>
                    <div className={styles.title}>{song.name}</div>
                    <div className={styles.artist}>{song.composer}</div>
                  </Link>

                  <audio
                    controls
                    src={song.url_path}
                    className={styles.audio}
                  ></audio>
                </div>
                <button
                  className={clsx(styles.songControls, {
                    [styles.active]: state?.favoriteMusic
                      .map((i) => i.id_music)
                      .includes(song.id_music),
                  })}
                  onClick={() => toggleFavorite(song.id_music)}
                >
                  <i className="fas fa-heart"></i>
                </button>
                {/* <div className={styles.moreOptions} onClick={(e) => {}}>
                  ...
                </div> */}
              </div>
            ))}
          </div>
        </>
      )}

      {playlist.length === 0 && (
        <div className={styles.empty}>
          <p>Chưa có danh sách phát nào.</p>
        </div>
      )}
    </div>
  );
}
