"use client";

import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "@/lib/axios";
import style from "./playlistDetail.module.scss";
import Link from "next/link";
import { addMusicToTheFirst } from "../../../../component/musicplayer";
import { AppContext } from "@/app/layout";
import { Img } from "react-image";

interface Playlist {
  id_playlist: string;
  name: string;
  url_cover: string;
  musics: Music[];
}
interface MusicHistory {
  id_music: string;
  created_at: string;
}

interface Music {
  id_music: string;
  name: string;
  producer: string;
  url_path: string;
  url_cover: string;
  total_duration: string | null;
  composer: string;
  artists: any[];
}

const PlaylistDetailPage: React.FC = ({ params }: any) => {
  const id = params.id;
  const [playlistDetail, setPlaylistDetail] = useState<Playlist | null>(null);
  // const [currentSong, setCurrentSong] = useState<Music | null>(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  const [menuVisible, setMenuVisible] = useState<string | null>(null); // Quản lý hiển thị menu
  const [submenuVisible, setSubmenuVisible] = useState<string | null>(null); // Quản lý hiển thị submenu
  const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [newName, setNewName] = useState<string>(""); // Tên mới của playlist
  const [error, setError] = useState<string | null>(null);
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    axios
      .get(`/playlist/me?id_playlist=${id}`)
      .then((response: any) => {
        setPlaylistDetail(response.result.data[0]);
        // console.log("playlistdetail:", response.result);
      })
      .catch((error) => {
        console.error("Error fetching playlist details", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // useEffect(() => {
  //   if (audioRef.current && currentSong) {
  //     audioRef.current.src = currentSong.url_path;
  //     audioRef.current.play();
  //     setIsPlaying(true);
  //   }
  // }, [currentSong]);

  const handlePlaySong = (music: Music) => {
    dispatch({ type: "IS_PLAYLING", payload: state?.isPlaying });
  };
  const toggleMenu = (id_music: string) => {
    setMenuVisible(menuVisible === id_music ? null : id_music); // Đóng mở menu
  };

  const toggleSubmenu = (id_music: string) => {
    setSubmenuVisible(submenuVisible === id_music ? null : id_music); // Đóng mở submenu
  };

  const deleteSongFromPlaylist = async (
    id_music: string,
    id_playlist: string
  ) => {
    try {
      // Gọi API để xóa bài hát khỏi playlist
      const response = await axios.delete("/playlist/add-music", {
        data: { id_music: String(id_music), id_playlist: String(id_playlist) },
      });

      if (response.status === 200) {
        // Xóa thành công, cập nhật lại danh sách bài hát trong playlist
        setPlaylistDetail((prevPlaylist) => {
          if (prevPlaylist) {
            return {
              ...prevPlaylist,
              musics: prevPlaylist.musics.filter(
                (music) => music.id_music !== id_music
              ),
            };
          }
          return prevPlaylist;
        });
        alert("Xóa bài hát khỏi playlist thành công!");
      }
    } catch (error) {
      console.error("Error deleting song from playlist:", error);
      alert("Đã xảy ra lỗi khi xóa bài hát khỏi playlist!");
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

  const handleEditPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim()) {
      // Kiểm tra nếu newName rỗng
      setError("Vui lòng nhập tên playlist");
      return;
    }

    try {
      const response: any = await axios.patch("/playlist/me", {
        id_playlist: playlistDetail?.id_playlist,
        name: newName,
      });

      if (response.status === 200) {
        // Cập nhật lại dữ liệu sau khi sửa thành công
        setPlaylistDetail((prev) => prev && { ...prev, name: newName });
        alert("Cập nhật playlist thành công!");
        setIsEditing(false); // Đóng modal
        setError(null); // Xóa lỗi cũ
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
      alert("Đã xảy ra lỗi khi cập nhật playlist.");
    }
  };

  if (loading) {
    return <p>Đang tải chi tiết playlist...</p>;
  }

  if (!playlistDetail) {
    return <p>Không tìm thấy playlist</p>;
  }

  return (
    <div className={style.contentwrapper}>
      <div className={style.banner}>
        <img
          src="https://adtima-media.zascdn.me/2024/05/28/1e75f3b2-dd19-46c6-ae1a-84611017eaf9.jpg"
          alt=""
          className={style.bannerImage}
        />
      </div>
      <div className={style.modalContent}>
        <div className={style.modalContentRight}>
          <div className={style.imageContainer1}>
            {playlistDetail.musics.slice(0).map((music) => (
              <Img
                src={music.url_cover} // URL ảnh từ album
                alt={music.name}
                className={style.coverImage}
                // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                unloader={
                  <img
                    src="/default.png"
                    alt="default"
                    className={style.coverImage}
                  />
                } // Thay thế ảnh khi lỗi
              />
            ))}
          </div>
          <h2>{playlistDetail.name}</h2>

          <button
            className={style.editButton}
            onClick={() => setIsEditing(true)}
          >
            <i className="fas fa-edit"></i> Sửa
          </button>

          <p>Số bài hát: {playlistDetail.musics.length}</p>
        </div>
        {/* Modal chỉnh sửa playlist */}
        {isEditing && (
          <div className={style.editModal}>
            <form onSubmit={handleEditPlaylist}>
              <label>
                Sửa tên playlist:
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setError(null); // Xóa lỗi khi người dùng chỉnh sửa
                  }}
                  placeholder="Tên playlist mới"
                  // required
                />
              </label>
              {error && <p className={style.error}>{error}</p>}

              <div className={style.buttonGroup}>
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
        <div className={style.modalContentLeft}>
          <h2>Danh sách bài hát</h2>

          {playlistDetail.musics.map((music) => (
            <div
              key={music.id_music}
              className={style.songContent}
              onClick={() => handlePlaySong(music)}
            >
              <div className={style.imageContainer}>
                <Img
                  src={music.url_cover} // URL ảnh từ album
                  alt={music.name}
                  className={style.coverImage}
                  // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                  unloader={
                    <img
                      src="/default.png"
                      alt="default"
                      className={style.coverImage}
                    />
                  } // Thay thế ảnh khi lỗi
                />
                v
                <button
                  className={style.playButton}
                  onClick={async () => {
                    addMusicToTheFirst(
                      state,
                      dispatch,
                      music.id_music.toString(),
                      music.name,
                      music.url_path,
                      music.url_cover,
                      music.composer,
                      music?.artists?.map((artist) => artist.artist)
                    );

                    addMusicToHistory(music.id_music.toString(), 100);

                    if (
                      music.id_music === state?.currentPlaylist[0]?.id_music &&
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
              <p className={style.songTitle}>
                <strong className={style.strong}>
                  <Link href={`/musicdetail/${music.id_music}`}>
                    {music.name}
                  </Link>
                </strong>
              </p>
              <p className={style.speed}>
                <Link href={`/musicdetail/${music.id_music}`}>
                  {music.composer}
                </Link>
              </p>

              <i
                className="fas fa-ellipsis-h"
                onClick={() => toggleMenu(music.id_music)}
              ></i>

              {menuVisible === music.id_music && (
                <div className={style.menu}>
                  <button
                    onClick={() =>
                      deleteSongFromPlaylist(
                        music.id_music,
                        playlistDetail.id_playlist
                      )
                    }
                  >
                    Xóa bài hát
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* <audio ref={audioRef} onEnded={() => setIsPlaying(false)} /> */}
    </div>
  );
};

export default PlaylistDetailPage;
