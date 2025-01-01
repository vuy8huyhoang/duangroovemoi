"use client";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import styles from "./search.module.scss";
import Link from "next/link";
import MusicPartner from "../../component/home/musicpartner";
import { Img } from "react-image";
import clsx from "clsx";
import { convertToHttps, formatTimeFromNow } from "@/utils/String";
import { AppContext } from "../../layout";
import { saveAs } from "file-saver";
import { addMusicToTheFirst } from "../../component/musicplayer";
import AlbumModel from "@/models/AlbumModel";

const SearchResultsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [musicList, setMusicList] = useState<any[]>([]);
  const [albumList, setAlbumList] = useState<any[]>([]);
  const [artistList, setArtistList] = useState<any[]>([]);
  // const [composerList, setcomposerList] = useState<any[]>([]);

  // const [currentComposerPage, setCurrentComposerPage] = useState(1);
  const [currentType, setCurrentType] = useState("music");
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");
  const [submenuVisible, setSubmenuVisible] = useState<number | null>(null);
  const { state, dispatch } = useContext(AppContext);
  const [playlists, setPlaylists] = useState([]);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        try {
          const response: any = await axios.get(
            `search?search_text=${encodeURIComponent(query)}`
          );
          const data = response.result.data;
          setMusicList(data.musicList || []);
          setAlbumList(data.albumList || []);
          setArtistList(data.artistList || []);
          // setcomposerList(data.composerList || []);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }
    };

    fetchSearchResults();
  }, [query]);

  // const paginatedComposers = composerList.slice(
  //   (currentComposerPage - 1) * itemsPerPage0,
  //   currentComposerPage * itemsPerPage0
  // );
  // const totalComposerPages = Math.ceil(composerList.length / itemsPerPage0);

  const addMusicToHistory = async (id_music: string, play_duration: number) => {
    try {
      const response: any = await axios.post("/music-history/me", {
        id_music,
        play_duration,
      });
      const newHistory = response.result;
      // console.log("Added to history:", newHistory);
    } catch (error) {
      console.error("Error adding to music history:", error);
    }
  };

  const handleHeartClick = (id_music) => {
    if (state?.profile) {
      if (state?.favoriteMusic.map((i) => i.id_music).includes(id_music)) {
        axios
          .delete(`favorite-music/me?id_music=${id_music}`)
          .then((response: any) => {
            // console.log("Album unliked successfully", response);
            dispatch({
              type: "FAVORITE_MUSIC",
              payload: [
                ...state.favoriteMusic.filter((i) => i.id_music !== id_music),
              ],
            });
          })
          .catch((error: any) => {
            console.error("Error unliking album", error);
          });
      } else {
        axios
          .post(`favorite-music/me`, { id_music })
          .then((response: any) => {
            // console.log("Album liked successfully", response);
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
  //

  return (
    <div className={styles.searchResultsContainer}>
      <h1>Kết quả tìm kiếm: {query}</h1>
      <div className="flex gap-3 mb-4">
        <button
          className={clsx(
            "px-[12px] py-[6px] rounded-[100px] border border-gray-500 text-[14px] text-gray-500 font-normal",
            { [styles?.activeBtn]: currentType === "music" }
          )}
          onClick={() => setCurrentType("music")}
        >
          Bài hát
        </button>
        <button
          className={clsx(
            "px-[12px] py-[6px] rounded-[100px] border border-gray-500 text-[14px] text-gray-500 font-normal",
            { [styles?.activeBtn]: currentType === "album" }
          )}
          onClick={() => setCurrentType("album")}
        >
          Album
        </button>
        <button
          className={clsx(
            "px-[12px] py-[6px] rounded-[100px] border border-gray-500 text-[14px] text-gray-500 font-normal",
            { [styles?.activeBtn]: currentType === "artist" }
          )}
          onClick={() => setCurrentType("artist")}
        >
          Nghệ sĩ
        </button>
      </div>
      {currentType === "music" && musicList.length > 0 && (
        <section className="mx-[-10px]">
          {/* <h2 className="home__heading home__heading__noMargin">Bài hát có chứa son tung</h2> */}
          <div className={clsx(styles.albumList, "")}>
            {musicList
              .sort((a, b) => b.view - a.view)
              .slice(0, 6)
              .map((music) => (
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
                          className={clsx(
                            styles.albumCover,
                            styles.albumCover__default
                          )}
                        />
                      } // Thay thế ảnh khi lỗi
                    />
                    <div className={styles.overlay}>
                      <button
                        className={styles.playButton}
                        onClick={async () => {
                          addMusicToTheFirst(
                            state,
                            dispatch,
                            music.id_music.toString(),
                            music.name,
                            music.url_path,
                            music.url_cover,
                            music.id_composer.name,
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
                          <i className="fas fa-pause text-white"></i>
                        ) : (
                          <i className="fas fa-play text-white"></i>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className={styles.songInfo}>
                    <div className={clsx(styles.songName)}>
                      <Link href={`/musicdetail/${music.id_music}`}>
                        {music.name}
                      </Link>
                    </div>
                    <div className={styles.composerName}>
                      <Link href={`/musicdetail/${music.id_music}`}>
                        {music?.artists.map((i) => i?.name)}
                      </Link>
                    </div>
                    <div className={styles.view}>
                      <Link href={"#"}>
                        {/* {formatTimeFromNow(music.created_at)} */}
                        {music?.id_composer?.name &&
                          "Sáng tác: " + music?.id_composer?.name}
                      </Link>
                    </div>
                  </div>

                  <div className={styles.songControls}>
                    <i
                      className={`fas fa-heart ${
                        state?.favoriteMusic
                          .map((i) => i.id_music)
                          .includes(music.id_music)
                          ? styles.activeHeart
                          : ""
                      }`}
                      onClick={() => handleHeartClick(music.id_music)}
                    ></i>
                    <button
                      className="relative"
                      onClick={() => toggleMenu(music.id_music)}
                    >
                      <i className="fas fa-ellipsis-h"></i>

                      {menuVisible === music.id_music && (
                        <div
                          className={clsx(
                            styles.menu,
                            "absolute top-[50%] w-[150px]"
                          )}
                          style={{
                            right: "calc(100% + 10px)",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <button
                            onClick={() =>
                              dispatch({
                                type: "PLAYLIST_LAYER",
                                payload: music?.id_music,
                              })
                            }
                          >
                            Thêm vào playlist
                          </button>
                          <button onClick={() => downloadMusic(music.url_path)}>
                            Tải về
                          </button>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {currentType === "album" && albumList.length > 0 && (
        <section>
          {/* <h2>Album</h2> */}
          <ul className="grid grid-cols-12 gap-4">
            {albumList.map((album: AlbumModel) => (
              <li
                key={album.id_album}
                className={clsx(styles.songItem, "col-span-2 mb-4")}
              >
                <div
                  key={album.id_album}
                  className={`${clsx("flex-col")} ${
                    hoveredSong === album.id_album ? styles.hovered : ""
                  }`}
                  onMouseEnter={() => setHoveredSong(album.id_album)}
                  onMouseLeave={() => setHoveredSong(null)}
                >
                  <div key={album.id_album} className={clsx("flex-col")}>
                    <div
                      className={clsx(
                        styles.musicCoverWrapper,
                        "!w-full aspect-square"
                      )}
                    >
                      <Img
                        src={album.url_cover} // URL ảnh từ music
                        alt={album.name}
                        className="rounded-[10px]"
                        // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                        unloader={
                          <img
                            src="/default.png"
                            alt="default"
                            className={styles.musicCover}
                          />
                        } // Thay thế ảnh khi lỗi
                      />
                      {/* <div className={styles.overlay}>
                        <button
                          className={styles.playButton}
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
                        styles.songInfo,
                        "!ml-0 w-full flex items-center justify-center flex-col mt-3"
                      )}
                    >
                      <div className={clsx(styles.songName, "text-center")}>
                        <Link href={`/albumdetail/${album.id_album}`}>
                          {album.name}
                        </Link>
                      </div>
                      <div className={styles.view}>
                        <Link href={"#"}>
                          {formatTimeFromNow(album.created_at)}
                        </Link>
                      </div>
                    </div>

                    {/* <div className={styles.songControls}>
                      <i
                        className={`fas fa-heart ${
                          album.has(album.id_music as any)
                            ? styles.activeHeart
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
                              styles.menu,
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
                              <div className={styles.submenu}>
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
                {/* <span className={styles.songTitle}>
                  {music.name ? music.name : "Chưa có tên bài hát"}
                </span> */}
              </li>
            ))}
          </ul>
        </section>
      )}

      {currentType === "artist" && artistList.length > 0 && (
        <section>
          {/* <h2>Nghệ sĩ</h2> */}
          <div className="grid grid-cols-12 gap-4">
            {artistList.map((artist) => (
              <Link
                key={artist.id_artist}
                href={`/artistdetail/${artist.id_artist}`}
                className={clsx(
                  styles.artistItem,
                  "col-span-2 mb-4 flex flex-col"
                )}
              >
                <Img
                  src={artist.url_cover} // URL ảnh từ album
                  alt={artist.name}
                  className={"w-full aspect-square rounded-full object-cover"}
                  // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                  unloader={
                    <img
                      src="/default.png"
                      alt="default"
                      className={styles.artistImage}
                    />
                  } // Thay thế ảnh khi lỗi
                />
                <p className="text-[14px] text-gray-200 font-medium">
                  {artist.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* {composerList.length > 0 && (
        <section>
          <h2>Nhạc sĩ</h2>
          <div className={styles.artistList}>
            {paginatedComposers.map((composer) => (
              <Link
                key={composer.id_artist}
                href={`/composerdetail/${composer.id_composer}`}
                className={styles.artistItem}
              >
               
        
                <p className={styles.artistName}>{composer.name}</p>
              </Link>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              disabled={currentComposerPage === 1}
              onClick={() => setCurrentComposerPage(currentComposerPage - 1)}
            >
              Trước
            </button>
            <span>
              Trang {currentComposerPage} / {totalComposerPages}
            </span>
            <button
              disabled={currentComposerPage === totalComposerPages}
              onClick={() => setCurrentArtistPage(currentComposerPage + 1)}
            >
              Sau
            </button>
          </div>
        </section>
      )} */}

      {/* <MusicPartner /> */}
    </div>
  );
};

export default SearchResultsPage;
