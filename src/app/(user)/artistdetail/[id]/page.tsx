"use client";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "@/lib/axios";
import style from "./songdetail.module.scss";
import { addMusicToTheFirst } from "@/app/component/musicplayer";
import { AppContext } from "@/app/layout";
import { Img } from "react-image";
import clsx from "clsx";
import { convertToHttps, formatTimeFromNow } from "@/utils/String";
import Link from "next/link";
import { saveAs } from "file-saver";
import AlbumModel from "@/models/AlbumModel";

interface Artist {
  id_artist: string;
  name: string;
  url_cover: string;
  created_at: string;
  last_update: string;
  is_show: string;
  followers: string;
  description: string;
}

interface Music {
  id_music: string;
  name: string;
  url_cover: string;
  url_path: string;
  composer: string;
  artists: any[];
  genre: string;
  music: string;
  musics: {
    id_music: string;
  };
  view: number;
  created_at: string;
}
interface MusicHistory {
  id_music: string;
  created_at: string;
}

interface Playlist {
  id_playlist: string;
  id_music: string;
  name: string;
  index_order: number;
}

export default function ArtistDetail({ params }) {
  const { id } = params; // Get id from URL params
  const [artist, setArtist] = useState<Artist | null>(null);
  const [musicList, setMusicList] = useState<Music[]>([]); // Lưu trữ danh sách bài hát của nghệ sĩ
  const [albumList, setAlbumList] = useState<AlbumModel[]>([]); // Lưu trữ danh sách bài hát của nghệ sĩ
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
  const { state, dispatch } = useContext(AppContext);
  const [submenuVisible, setSubmenuVisible] = useState<number | null>(null);
  const [favoriteMusic, setFavoriteMusic] = useState<Set<number>>(new Set());
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const toggleMenu = (id: number) => {
    setMenuVisible((prev) => (prev === id ? null : id));
  };

  const toggleSubmenu = (id: number) => {
    if (!state?.profile) {
      dispatch({ type: "SHOW_LOGIN", payload: true });
    } else if (state?.profile?.is_vip !== 1) {
      dispatch({ type: "SHOW_VIP", payload: true });
    } else {
      axios.get("playlist/me").then((res: any) => {
        if (res.result.data.length > 0) {
          setSubmenuVisible((prev) => (prev === id ? null : id));
        } else alert("Hiện bạn không có playlist");
      });
    }
  };

  // Lấy thông tin nghệ sĩ
  useEffect(() => {
    if (id) {
      axios
        .get(`artist/${id}`)
        .then((response: any) => {
          if (response && response.result.data) {
            setArtist(response.result.data);
          } else {
            console.error("Response data is undefined or null", response);
          }
        })
        .catch((error) => {
          console.error("Error fetching artist details", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    axios
      .get(`album?id_artist=${id}`)
      .then((response: any) => {
        if (response && response.result.data) {
          setAlbumList(
            response.result.data.sort(
              (a: { created_at: string }, b: { created_at: string }) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
          );
        } else {
          console.error("Response data is undefined or null", response);
        }
      })
      .catch((error) => {
        console.error("Error fetching album details", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  const handleFollowClick = (id_artist) => {
    axios
      .post(`/follow/me`, { id_artist })
      .then((response: any) => {
        // console.log('Album followed successfully', response);
        setIsFollowed(true);
      })
      .catch((error: any) => {
        console.error("Error following album", error);
      });
  };
  const unFollowClick = (id_artist) => {
    axios
      .delete(`/follow/me?id_artist=${id_artist}`)
      .then((response: any) => {
        // console.log("Album unfollowed successfully", response);
        setIsFollowed(false);
      })
      .catch((error: any) => {
        console.error("Error unfollowing album", error);
      });
  };

  const addToPlaylist = async (
    id_music,
    id_playlist: string,
    index_order: number
  ) => {
    try {
      await axios.post("/playlist/add-music", {
        id_music,
        id_playlist,
        index_order,
      });
      alert(`Bài hát đã được thêm vào playlist!`);
      // console.log("dữ liệu đc thêm:", id_music, id_playlist, index_order);
    } catch (error) {
      console.error("Error adding to playlist:", error);
      alert(`Lỗi khi thêm bài hát vào playlist.`);
      console.error("Error updating favorite music:", error);
    }
  };

  // Lấy danh sách bài hát của nghệ sĩ
  useEffect(() => {
    if (id) {
      axios
        .get(`/music?id_artist=${id}`)
        .then((response: any) => {
          if (response && response.result.data) {
            setMusicList(
              response.result.data.sort(
                (a: { created_at: string }, b: { created_at: string }) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
            );
          } else {
            console.error("No music data found for artist", response);
          }
        })
        .catch((error) => {
          console.error("Error fetching music list for artist", error);
        });
    }
  }, [id]);
  useEffect(() => {
    axios.get("follow/me").then((response: any) => {
      //   console.log(response.result.data, artist);
      //   console.log(
      //     response.result.data.map((i) => i.id_artist).includes(artist?.id_artist)
      //   );

      if (response && response.result.data) {
        if (
          response.result.data
            .map((i) => i.id_artist)
            .includes(artist?.id_artist)
        ) {
          setIsFollowed(true);
        }
      } else {
        console.error("Response data is undefined or null", response);
      }
    });
  }, [id, artist]);

  const toggleFavorite = async (id_music: number) => {
    if (state?.profile) {
      const isFavorite = favoriteMusic.has(id_music);

      setFavoriteMusic((prev) => {
        const updated = new Set(prev);
        if (isFavorite) {
          updated.delete(id_music);
        } else {
          updated.add(id_music);
        }
        return updated;
      });

      const updatedFavoriteMusic = isFavorite
        ? state.favoriteMusic.filter((music) => music.id_music !== id_music)
        : [...state.favoriteMusic, { id_music }];

      dispatch({
        type: "FAVORITE_MUSIC",
        payload: updatedFavoriteMusic,
      });

      try {
        if (isFavorite) {
          await axios.delete(`/favorite-music/me?id_music=${id_music}`);
          // alert("Xóa bài hát yêu thích thành công");
        } else {
          await axios.post("/favorite-music/me", { id_music });
          // alert("Thêm bài hát yêu thích thành công");
        }
      } catch (error) {
        console.error("Error updating favorite music:", error);
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
        audioRef.current.load(); // Đảm bảo src mới đã tải
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => console.error("Lỗi khi phát audio:", error));
      }
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!artist) {
    return <div>Không tìm thấy nghệ sĩ này.</div>;
  }
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

  const downloadMusic = (url: string) => {
    url = convertToHttps(url);
    if (!state?.profile) {
      dispatch({ type: "SHOW_LOGIN", payload: true });
    } else if (state?.profile?.is_vip !== 1) {
      dispatch({ type: "SHOW_VIP", payload: true });
    } else {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("File không tồn tại hoặc không thể tải.");
          }
          return response.blob(); // Chuyển dữ liệu thành Blob
        })
        .then((blob) => {
          const fileName = url.split("/").pop(); // Lấy tên file từ URL
          saveAs(blob, fileName); // Tải file xuống với tên lấy từ URL
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi tải file:", error);
        });
    }
  };

  return (
    <div className={clsx(style.contentwrapper, "pb-[20px]")}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1"></div>
        <div className="col-span-2">
          <Img
            src={artist.url_cover} // URL ảnh từ album
            alt={artist.name}
            className="w-full aspect-square object-cover rounded-full"
            // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
            unloader={<img src="/default.png" alt="default" />} // Thay thế ảnh khi lỗi
          />
        </div>
        <div className="col-span-9 flex justify-center items-start flex-col">
          <div className="font-bold text-[24px] text-gray-200">
            {artist.name}
          </div>
          <div className="font-medium text-[18px] text-gray-500">
            Followers:{artist.followers}
          </div>
          {isFollowed ? (
            <button
              className={clsx(style.followButton, "mt-4")}
              onClick={() => unFollowClick(artist.id_artist)}
            >
              Đã Theo Dõi
            </button>
          ) : (
            <button
              className={clsx(style.followButton, "mt-4")}
              onClick={() => handleFollowClick(artist.id_artist)}
            >
              {" "}
              Theo Dõi{" "}
            </button>
          )}
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* <div className={style.cartartist}>
                <p><strong>Followers:</strong> {artist.followers}</p>
                <p><strong>Created at:</strong> {new Date(artist.created_at).toLocaleDateString()}</p>
                <p><strong>Last Update:</strong> {new Date(artist.last_update).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {artist.is_show === '1' ? 'Visible' : 'Hidden'}</p>
                <p><strong>Description:</strong> {artist.description}</p>
            </div> */}
      <h3 className="text-[20px] font-semibold text-gray-200 mt-4 capitalize">
        Bài hát nổi bật
      </h3>
      {/* Hiển thị danh sách bài hát của nghệ sĩ */}
      <div className={style.cartMusic}>
        {musicList.length > 0 ? (
          <ul className="grid grid-cols-12 gap-4">
            {musicList.map((music: Music) => (
              <li
                key={music.id_music}
                className={clsx(style.songItem, "col-span-4 mb-4")}
              >
                <div
                  key={music.id_music}
                  className={`${clsx(
                    style.songCard,
                    "!w-full pr-2 pt-1 pb-1 pl-1"
                  )} ${hoveredSong === music.id_music ? style.hovered : ""}`}
                  onMouseEnter={() => setHoveredSong(music.id_music)}
                  onMouseLeave={() => setHoveredSong(null)}
                >
                  {/* <div className={style.image}>
                    <Img
                      src={music.url_cover} // URL ảnh từ album
                      alt={music.name}
                      className={style.musicCover}
                      // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                      unloader={
                        <img
                          src="/default.png"
                          alt="default"
                          className={style.musicCover}
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
                        {music.id_music ===
                          state?.currentPlaylist[0]?.id_music &&
                        state?.isPlaying ? (
                          <i className="fas fa-pause"></i>
                        ) : (
                          <i className="fas fa-play"></i>
                        )}
                      </button>
                    </div>
                  </div> */}
                  <div
                    key={music.id_music}
                    className={clsx(
                      style.songCard,
                      "!w-full pr-2 pt-1 pb-1 pl-1"
                    )}
                  >
                    <div
                      className={clsx(
                        style.musicCoverWrapper,
                        "relative !w-[60px] aspect-square"
                      )}
                    >
                      <Img
                        src={music.url_cover} // URL ảnh từ music
                        alt={music.name}
                        className={style.musicCover}
                        // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                        unloader={
                          <img
                            src="/default.png"
                            alt="default"
                            className={clsx(
                              style.musicCover,
                              style.musicCover__default
                            )}
                          />
                        } // Thay thế ảnh khi lỗi
                      />
                      <div className={style.overlay}>
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
                              music.artists.map((artist) => artist.artist)
                            );
                            addMusicToHistory(music.id_music.toString(), 100);

                            if (
                              music.id_music ===
                                state?.currentPlaylist[0]?.id_music &&
                              state?.isPlaying
                            ) {
                              dispatch({ type: "IS_PLAYING", payload: false });
                            }
                          }}
                        >
                          {music.id_music ===
                            state?.currentPlaylist[0]?.id_music &&
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
                        <Link href={`/musicdetail/${music.id_music}`}>
                          {music.name}
                        </Link>
                      </div>
                      <div className={style.composerName}>
                        <Link href={`/musicdetail/${music.id_music}`}>
                          {music.composer && "Sáng tác: " + music.composer}
                        </Link>
                      </div>
                      <div className={style.view}>
                        {formatTimeFromNow(music.created_at)}
                        {/* Lượt xem: {music.view} */}
                      </div>
                    </div>

                    <div className={style.songControls}>
                      <i
                        className={`fas fa-heart ${
                          favoriteMusic.has(music.id_music as any)
                            ? style.activeHeart
                            : ""
                        }`}
                        onClick={() => toggleFavorite(music.id_music as any)}
                      ></i>
                      <button
                        className="relative"
                        onClick={() => toggleMenu(music.id_music as any)}
                      >
                        <i className="fas fa-ellipsis-h"></i>

                        {menuVisible === (music.id_music as any) && (
                          <div
                            className={clsx(
                              style.menu,
                              "absolute top-[50%] w-[150px]"
                            )}
                            style={{
                              right: "calc(100% + 10px)",
                              transform: "translateY(-50%)",
                            }}
                          >
                            <button
                              onClick={() => {
                                if (state?.profile) {
                                  if (state?.profile?.is_vip === 1) {
                                    dispatch({
                                      type: "PLAYLIST_LAYER",
                                      payload: music?.id_music,
                                    });
                                  } else {
                                    dispatch({
                                      type: "SHOW_VIP",
                                      payload: true,
                                    });
                                  }
                                } else {
                                  dispatch({
                                    type: "SHOW_LOGIN",
                                    payload: true,
                                  });
                                }
                              }}
                            >
                              Thêm vào playlist
                            </button>
                            <button
                              onClick={() => downloadMusic(music.url_path)}
                            >
                              Tải về
                            </button>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                {/* <span className={style.songTitle}>
                  {music.name ? music.name : "Chưa có tên bài hát"}
                </span> */}
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có bài hát nào cho nghệ sĩ này.</p>
        )}
      </div>

      <h3 className="text-[20px] font-semibold text-gray-200 mt-4 capitalize pt-4">
        Album của {artist.name}
      </h3>
      {/* Hiển thị danh sách bài hát của nghệ sĩ */}
      <div className={style.cartMusic}>
        {albumList.length > 0 ? (
          <ul className="grid grid-cols-12 gap-4">
            {albumList.map((album: AlbumModel) => (
              <li
                key={album.id_album}
                className={clsx(style.songItem, "col-span-2 mb-4")}
              >
                <div
                  key={album.id_album}
                  className={`${clsx("flex-col")} ${
                    hoveredSong === album.id_album ? style.hovered : ""
                  }`}
                  onMouseEnter={() => setHoveredSong(album.id_album)}
                  onMouseLeave={() => setHoveredSong(null)}
                >
                  <div key={album.id_album} className={clsx("flex-col")}>
                    <div
                      className={clsx(
                        style.musicCoverWrapper,
                        "!w-full aspect-square"
                      )}
                    >
                      <Img
                        src={album.url_cover} // URL ảnh từ music
                        alt={album.name}
                        className={style.musicCover}
                        // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                        unloader={
                          <img
                            src="/default.png"
                            alt="default"
                            className={style.musicCover}
                          />
                        } // Thay thế ảnh khi lỗi
                      />
                      {/* <div className={style.overlay}>
                        <button
                          className={style.playButton}
                          onClick={async () => {
                            addMusicToTheFirst(
                              state,
                              dispatch,
                              album.album.toString(),
                              album.name,
                              album.url_path,
                              album.url_cover,
                              album.composer,
                              album.artists.map((artist) => artist.artist)
                            );
                            addMusicToHistory(album.album.toString(), 100);

                            if (
                              album.id_music ===
                                state?.currentPlaylist[0]?.id_music &&
                              state?.isPlaying
                            ) {
                              dispatch({ type: "IS_PLAYING", payload: false });
                            }
                          }}
                        >
                          {album.id_music ===
                            state?.currentPlaylist[0]?.id_music &&
                          state?.isPlaying ? (
                            <i className="fas fa-pause"></i>
                          ) : (
                            <i className="fas fa-play"></i>
                          )}
                        </button>
                      </div> */}
                    </div>
                    <div
                      className={clsx(
                        style.songInfo,
                        "!ml-0 w-full flex items-center justify-center flex-col mt-3"
                      )}
                    >
                      <div className={style.songName}>
                        <Link href={`/albumdetail/${album.id_album}`}>
                          {album.name}
                        </Link>
                      </div>
                      <div className={style.view}>
                        <Link href={"#"}>
                          {formatTimeFromNow(album.created_at)}
                        </Link>
                      </div>
                    </div>

                    {/* <div className={style.songControls}>
                      <i
                        className={`fas fa-heart ${
                          album.has(album.id_music as any)
                            ? style.activeHeart
                            : ""
                        }`}
                        onClick={() => toggleFavorite(album.id_music as any)}
                      ></i>
                      <button
                        className="relative"
                        onClick={() => toggleMenu(album.id_music as any)}
                      >
                        <i className="fas fa-ellipsis-h"></i>

                        {menuVisible === (album.id_music as any) && (
                          <div
                            className={clsx(
                              style.menu,
                              "absolute top-[50%] w-[150px]"
                            )}
                            style={{
                              right: "calc(100% + 10px)",
                              transform: "translateY(-50%)",
                            }}
                          >
                            <button
                              onClick={() =>
                                toggleSubmenu(album.id_music as any)
                              }
                            >
                              Thêm vào playlist
                            </button>
                            {submenuVisible === (album.id_music as any) && (
                              <div className={style.submenu}>
                                {playlists.map((playlist, index) => (
                                  <button
                                    key={playlist.id_playlist}
                                    onClick={() =>
                                      addToPlaylist(
                                        album.id_music,
                                        playlist.id_playlist,
                                        (playlist.index_order = index)
                                      )
                                    }
                                  >
                                    {playlist.name}
                                  </button>
                                ))}
                              </div>
                            )}
                            <button
                              onClick={() => downloadMusic(album.url_path)}
                            >
                              Tải về
                            </button>
                          </div>
                        )}
                      </button>
                    </div> */}
                  </div>
                </div>
                {/* <span className={style.songTitle}>
                  {music.name ? music.name : "Chưa có tên bài hát"}
                </span> */}
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có bài hát nào cho nghệ sĩ này.</p>
        )}
      </div>
      <audio ref={audioRef} />
    </div>
  );
}
