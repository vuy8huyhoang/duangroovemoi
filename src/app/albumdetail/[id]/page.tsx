"use client";
import { useEffect, useState, useRef, useCallback, useContext } from "react";
import axios from "@/lib/axios";
import style from "./albumdetail.module.scss";
import AlbumHot from "@/app/component/home/albumhot";
import MusicPartner from "@/app/component/home/musicpartner";
import clsx from "clsx";
import {
  addListMusicToTheFirst,
  addMusicToTheEnd,
  addMusicToTheFirst,
} from "@/app/component/musicplayer";
import { AppContext } from "@/app/layout";
import Link from "next/link";
import { Img } from "react-image";

interface Artist {
  id_artist: string;
  name: string;
  slug: string;
  url_cover: string;
}

interface Music {
  id_music: string | null;
  name: string | null;
  url_path: string | null;
  total_duration: string | null;
  artist?: Artist;
  producer: string;
  url_cover?: string;
  id_composer: any;
  artists: any[];
  composer?: string;
}

interface AlbumDetail {
  id_album: string;
  name: string;
  slug: string;
  url_cover: string;
  release_date: string;
  artist: Artist;
  musics: Music[];
  music: Music;
  artists: any[];
}

interface MusicHistory {
  id_music: string;
  created_at: string;
}

export default function AlbumDetail({ params }) {
  const id = params.id; // Get id from URL
  const [albumDetail, setAlbumDetail] = useState<AlbumDetail | null>(null);

  const [currentSong, setCurrentSong] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [time, setTime] = useState([]);
  const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [heart, setHeart] = useState(false);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const { state, dispatch } = useContext(AppContext);
  useEffect(() => {
    axios
      .get(`/album/${id}`)
      .then((response: any) => {
        if (response && response.result.data) {
          setAlbumDetail(response.result.data);
        } else {
          console.error("Response data is undefined or null", response);
        }
        response.result.data.musics.map((music) => {
          const audio = new Audio(music.url_path);
          audio.onloadedmetadata = () => {
            // console.log(`Thời lượng: ${audio.duration} giây`);
            setTime((prev) => {
              return [...prev, audio.duration];
            });
          };
        });
      })

      .catch((error: any) => {
        console.error("Error fetching album details", error);
      })

      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    axios.get("follow/me").then((response: any) => {
      //   console.log(response.result.data, albumDetail, "chuhcuhcuh");
      //   console.log(
      //     response.result.data
      //       .map((i) => i.id_artist)
      //       .includes(albumDetail?.artist?.id_artist)
      //   );

      if (response && response.result.data) {
        if (
          response.result.data
            .map((i) => i.id_artist)
            .includes(albumDetail?.artist?.id_artist)
        ) {
          setIsFollowed(true);
        }
      } else {
        console.error("Response data is undefined or null", response);
      }
    });

    axios.get("favorite-album/me").then((response: any) => {
      if (response && response.result.data) {
        if (
          response.result.data
            .map((i) => i.id_album)
            .includes(albumDetail?.id_album)
        ) {
          setHeart(true);
        }
      } else {
        console.error("Response data is undefined or null", response);
      }
    });
  }, [id, albumDetail]);

  function formatTime(seconds) {
    seconds = Math.ceil(seconds);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url_path;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  const handleFollowClick = (id_artist) => {
    axios
      .post(`/follow/me`, { id_artist })
      .then((response: any) => {
        // console.log("Album followed successfully", response);
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

  const handleHeartClick = (id_album) => {
    if (heart == true) {
      axios
        .delete(`favorite-album/me?id_album=${id_album}`)
        .then((response: any) => {
          //   console.log("Album unliked successfully", response);
          setHeart(false);
        })
        .catch((error: any) => {
          console.error("Error unliking album", error);
        });
    } else {
      axios
        .post(`favorite-album/me`, { id_album })
        .then((response: any) => {
          //   console.log("Album liked successfully", response);
          setHeart(true);
        })
        .catch((error: any) => {
          console.error("Error liking album", error);
        });
    }
  };

  // const handlePlayRandomClick = () => {
  //     if (isPlaying) {
  //         pausePlaying(); // Pause if currently playing
  //     } else {
  //         continuePlaying(); // Continue playing if paused
  //     }
  // };

  // const continuePlaying = () => {
  //     if (albumDetail && albumDetail.musics.length > 0) {
  //         const randomIndex = Math.floor(Math.random() * albumDetail.musics.length);
  //         const randomSong = albumDetail.musics[randomIndex];
  //         setCurrentSong(randomSong);
  //         setIsPlaying(true);
  //     } else {
  //         console.log('No songs available to play.');
  //     }
  // };

  // const pausePlaying = () => {
  //     audioRef.current?.pause();
  //     setIsPlaying(false);
  // };
  // const playSong = (music: Music) => {
  //     if (audioRef.current) {
  //         if (currentSong?.id_music === music.id_music && isPlaying) {
  //             audioRef.current.pause();
  //             setIsPlaying(false);
  //         } else {
  //             setCurrentSong(music);
  //             audioRef.current.src = music.url_path;
  //             audioRef.current.play();
  //             setIsPlaying(true);
  //         }
  //     }
  // };
  // const handlePlayPause = useCallback((album: Music) => {
  //     if (currentSong?.id_music === album.id_music && isPlaying) {
  //         audioRef.current?.pause();
  //         setIsPlaying(false);
  //     } else {
  //         setCurrentSong(album);
  //         setIsPlaying(true);
  //     }
  // }, [currentSong, isPlaying]);

  if (loading) {
    return <p>Đang tải chi tiết album...</p>;
  }

  if (!albumDetail) {
    return <p>Không tìm thấy album</p>;
  }
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

  return (
    <>
      <div className={style.contentwrapper}>
        {/* <div className={style.image}> */}
        {/* <img src="./public/banner.jpg" alt="" /> */}
        {/* </div> */}
        <div className={clsx(style.albumDetail, "grid grid-cols-12 gap-4")}>
          <div
            className={clsx(
              style.albumDetailright,
              "col-span-3 flex flex-col items-center"
            )}
          >
            <Img
              src={albumDetail.url_cover} // URL ảnh từ album
              alt={albumDetail.name}
              className={style.albumCover}
              // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
              unloader={
                <img
                  src="/default.png"
                  alt="default"
                  className={style.albumCover}
                />
              } // Thay thế ảnh khi lỗi
            />
            <h1 className="text-gray-200">{albumDetail.name}</h1>
            <p className="text-gray-500 flex gap-[10px] w-100 items-center justify-start">
              {/* Nghệ sĩ:{" "} */}
              <Link href={"/artistdetail/" + albumDetail.artist.id_artist}>
                {albumDetail.artist.name}
              </Link>
              {isFollowed ? (
                <button
                  className={clsx(
                    style.followButton,
                    "border border-gray-500 text-gray-500"
                  )}
                  onClick={() => {
                    if (state?.profile) {
                      unFollowClick(albumDetail.artist.id_artist);
                    } else {
                      dispatch({ type: "SHOW_LOGIN", payload: true });
                    }
                  }}
                >
                  Đã Theo Dõi
                </button>
              ) : (
                <button
                  className={clsx(
                    style.followButton,
                    "border border-gray-500 text-gray-500"
                  )}
                  onClick={() => {
                    if (state?.profile) {
                      handleFollowClick(albumDetail.artist.id_artist);
                    } else {
                      dispatch({ type: "SHOW_LOGIN", payload: true });
                    }
                  }}
                >
                  Theo Dõi
                </button>
              )}
            </p>
            <p className="text-gray-500">
              Ngày phát hành:{" "}
              {albumDetail.release_date
                ? albumDetail.release_date
                : "Chưa có thông tin"}
            </p>
            <div className={style.buttonGroup}>
              {/* <button className={style.playButton} onClick={handlePlayRandomClick}>
                              {isPlaying ? 'Tạm Dừng' : 'Phát Ngẫu Nhiên'}
                          </button> */}
              {/* <button onClick={()=>{dispatch({type:'CURRENT_PLAYLIST',payload:[]})}}>Xóa</button>
                          <button onClick={()=>{console.log(state.currentPlaylist);
                          }}>log</button> */}
              <button
                className={style.playButton}
                onClick={() => {
                  // console.log(albumDetail, "chúchsuchscschswkfwhbflwf");
                  let musicList = [];
                  albumDetail.musics.map((music) => {
                    musicList.push({
                      id_music: music?.id_music,
                      name: music?.name,
                      url_path: music?.url_path,
                      url_cover: music?.url_cover,
                      composer: music?.id_composer.name,
                      artists: music?.artists.map((artist) => {
                        return { artist };
                      }),
                    });
                  });

                  addListMusicToTheFirst(state, dispatch, musicList);

                  if (
                    albumDetail.music.id_music ===
                      state?.currentPlaylist[0]?.id_music &&
                    state?.isPlaying
                  ) {
                    dispatch({
                      type: "IS_PLAYING",
                      payload: false,
                    });
                  }
                }}
              >
                {/* {albumDetail.music?.id_music === state.currentPlaylist[0]?.id_music && state.isPlaying ? (
                                <i className="fas fa-pause"></i>
                            ) : (
                                <i className="fas fa-play"></i>
                            )} */}
                {isPlaying ? "Dừng" : "Phát Nhạc"}
              </button>
              <span
                className={clsx(style.heartIcon, {
                  [style.heartIcon_active]: heart,
                })}
                onClick={() => handleHeartClick(albumDetail.id_album)}
              >
                ♥
              </span>
            </div>
          </div>
          <div className={clsx(style.albumDetailleft, "col-span-9")}>
            {/* <h2>Danh sách bài hát</h2> */}
            <div className={clsx(style.songHeader, "grid grid-cols-12 gap-4")}>
              <span className={"col-span-1"}></span>
              <span className={"col-span-1"}></span>
              <span
                className={
                  "font-medium text-[14px] col-span-4 text-center text-gray-300"
                }
              >
                Tên bài hát
              </span>
              <span
                className={
                  "font-medium text-[14px] col-span-3 text-center text-gray-300"
                }
              >
                Nhà Sản Xuất
              </span>
              <span
                className={
                  "font-medium text-[14px] col-span-3 text-center text-gray-300"
                }
              >
                Thời lượng
              </span>
            </div>
            <ul className={style.songList}>
              {albumDetail.musics.length > 0 ? (
                albumDetail.musics.map(
                  (track, index) => (
                    style.songTitle,
                    (
                      <li key={index} className="grid grid-cols-12 gap-4">
                        <span className="col-span-1 flex items-center justify-end text-[14px] text-regular text-gray-500">
                          {index + 1}.
                        </span>
                        <div
                          key={albumDetail.id_album}
                          className={clsx(
                            `${style.songCard} ${
                              hoveredSong === albumDetail.id_album
                                ? style.hovered
                                : ""
                            }`,
                            "col-span-1"
                          )}
                          onMouseEnter={() =>
                            setHoveredSong(albumDetail.id_album)
                          }
                          onMouseLeave={() => setHoveredSong(null)}
                        >
                          <div className={style.image}>
                            <Img
                              src={track.url_cover} // URL ảnh từ album
                              alt={albumDetail.name}
                              className={style.musicCover}
                              // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                              unloader={
                                <img
                                  src="/default.png"
                                  alt="default"
                                  className={clsx(style.musicCover)}
                                />
                              } // Thay thế ảnh khi lỗi
                            />

                            <div className={style.overlay}>
                              {/* <button
                                                    className={style.playButton1}
                                                    onClick={() => playSong(track)}
                                                >
                                                    <i className={`fas ${currentSong?.id_music === albumDetail.id_album && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                                                </button> */}
                              <button
                                className={style.playButton}
                                onClick={async () => {
                                  // Thêm nhạc vào playlist và phát nhạc
                                  addMusicToTheFirst(
                                    state,
                                    dispatch,
                                    track.id_music.toString(),
                                    track.name,
                                    track.url_path,
                                    track.url_cover,
                                    track.composer,
                                    track.artists.map((artist) => artist.artist)
                                  );

                                  // Thêm vào lịch sử nghe nhạc
                                  addMusicToHistory(
                                    track.id_music.toString(),
                                    100
                                  );

                                  // Dừng nhạc nếu đang phát và chọn lại nhạc
                                  if (
                                    track.id_music ===
                                      state?.currentPlaylist[0]?.id_music &&
                                    state?.isPlaying
                                  ) {
                                    dispatch({
                                      type: "IS_PLAYING",
                                      payload: false,
                                    });
                                  }
                                }}
                              >
                                {track.id_music ===
                                  state?.currentPlaylist[0]?.id_music &&
                                state?.isPlaying ? (
                                  <i className="fas fa-pause"></i>
                                ) : (
                                  <i className="fas fa-play"></i>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={"/musicdetail/" + track.id_music}
                          className="col-span-4 text-left text-[14px] text-regular flex items-center text-gray-500"
                        >
                          {track.name ? track.name : "Chưa có tên bài hát"}
                        </Link>
                        <span className="col-span-3 text-left text-[14px] text-regular flex items-center justify-center text-gray-500">
                          {track.producer ? track.producer : "Chưa có nghệ sĩ"}
                        </span>
                        <span className="col-span-3 text-left text-[14px] text-regular flex items-center justify-center text-gray-500">
                          {time[index]
                            ? formatTime(time[index])
                            : "Chưa có thời lượng"}
                        </span>
                      </li>
                    )
                  )
                )
              ) : (
                <p>Album này hiện chưa có bài hát nào.</p>
              )}
            </ul>
          </div>
        </div>

        {/* <audio ref={audioRef} /> */}
      </div>
      {/* <AlbumHot /> */}
      <MusicPartner />
    </>
  );
}
