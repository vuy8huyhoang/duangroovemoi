"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "@/lib/axios";
import style from "./songdetail.module.scss";
import AlbumHot from "@/app/component/home/albumhot";
import MusicPartner from "@/app/component/home/musicpartner";
import Comment from "../../component/comment";
import clsx from "clsx";
import { addMusicToTheFirst } from "@/app/component/musicplayer";
import { AppContext } from "@/app/layout";
import { Img } from "react-image";
import { formatTimeFromNow } from "@/utils/String";
import Link from "next/link";
interface Music {
  id_music: number;
  name: string;
  url_cover: string;
  url_path: string;
  types: { name: string }[];
  producer: string;
  release_date: string;
  composer: string;
  total_duration: string;
  created_at: string;
  artists: any[];
  lyrics: {
    id_lyrics: string;
    id_music: string;
    start_time: number;
    end_time: number;
    lyrics: string;
  }[];
}
interface Artist {
  id_artist: string;
  name: string;
  slug: string;
  url_cover: string;
}
interface MusicHistory {
  id_music: string;
  created_at: string;
}

const SongDetailPage = ({ params }: any) => {
  const id = params.id;
  const [musicdetail, setMusic] = useState<Music | null>(null);
  const [loading, setLoading] = useState(true);
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [currentSong, setCurrentSong] = useState<Music | null>(null);
  // const [hoveredSong, setHoveredSong] = useState<number | null>(null);
  const [time, setTime] = useState([]);
  // const [heart, setHeart] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
  const containerRef = useRef(null);
  const lyricsRefs = useRef([]);

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  function adjustLyrics(lyrics) {
    // Sắp xếp mảng theo start_time
    lyrics.sort((a, b) => a.start_time - b.start_time);

    // Duyệt qua mảng và điều chỉnh các khoảng thời gian
    for (let i = 0; i < lyrics.length - 1; i++) {
      const current = lyrics[i];
      const next = lyrics[i + 1];

      // Nếu thời gian bị trùng hoặc không khớp
      if (current.end_time > next.start_time) {
        next.start_time = current.end_time; // Điều chỉnh start_time của next
      } else if (current.end_time < next.start_time) {
        next.start_time = current.end_time; // Điều chỉnh end_time của current
      }
    }

    return lyrics;
  }

  useEffect(() => {
    axios
      .get(`/music/${id}`)
      .then((response: any) => {
        if (response && response.result.data) {
          setMusic({
            ...response.result.data,
            lyrics: adjustLyrics(response.result.data.lyrics),
          });
          console.log({
            ...response.result.data,
            lyrics: adjustLyrics(response.result.data.lyrics),
          });
        } else {
          console.error("Response data is undefined or null", response);
        }

        response.result.data.musics.map((musicData) => {
          const audio = new Audio(musicData.url_path);
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
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    console.log(state?.currentDuration);
  }, [state?.currentDuration]);

  const handleHeartClick = (id_music) => {
    if (state?.profile) {
      if (state?.favoriteMusic.map((i) => i.id_music).includes(id_music)) {
        axios
          .delete(`favorite-music/me?id_music=${id_music}`)
          .then((response: any) => {
            console.log("Album unliked successfully", response);
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
            console.log("Album liked successfully", response);
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

  useEffect(() => {
    // Tìm lyric đang active
    if (id === state?.currentPlaylist?.[0]?.id_music) {
      const activeIndex = musicdetail?.lyrics.findIndex(
        (lyric) =>
          state?.currentDuration >= lyric.start_time &&
          state?.currentDuration < lyric.end_time
      );

      if (activeIndex !== -1 && lyricsRefs.current[activeIndex]) {
        const activeElement = lyricsRefs.current[activeIndex];
        const container = containerRef.current;

        // Cuộn trong container, không cuộn toàn trang
        if (container && activeElement) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = activeElement.getBoundingClientRect();

          // Kiểm tra nếu phần tử nằm ngoài khung nhìn của container
          if (
            elementRect.top < containerRect.top || // Trên khung nhìn
            elementRect.bottom > containerRect.bottom // Dưới khung nhìn
          ) {
            container.scrollTop +=
              elementRect.top - containerRect.top - container.clientHeight / 2;
          }
        }
      }
    }
  }, [state?.currentDuration, musicdetail?.lyrics]);

  if (loading) {
    return <p>Đang tải chi tiết bài hát...</p>;
  }

  // if (!musicdetail && artistdetail) {
  //   return <p>Không tìm thấy music</p>;
  // }

  return (
    <>
      <div className={style.contentwrapper}>
        {/* <div className={style.banner}>
        <img
          src="https://adtima-media.zascdn.me/2024/05/28/1e75f3b2-dd19-46c6-ae1a-84611017eaf9.jpg"
          alt=""
          className={style.bannerImage}
        />
      </div> */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <div className="w-full rounded-[10px] overflow-hidden mb-4">
              <Img
                src={musicdetail.url_cover} // URL ảnh từ album
                alt={musicdetail.name}
                className="w-full object-cover aspect-square"
                // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                unloader={
                  <img
                    src="/default.png"
                    alt="default"
                    className={style.coverImage}
                  />
                } // Thay thế ảnh khi lỗi
              />
            </div>
            <h2 className="text-gray-200 text-[24px] font-medium text-center">
              {musicdetail.name}
            </h2>
            <div
              className={clsx(
                style.audioPlayer,
                "flex items-center justify-center mb-4"
              )}
            >
              {state?.currentPlaylist?.[0]?.id_music !==
                musicdetail.id_music && (
                <button
                  className={clsx(
                    style.playButton,
                    "border border-gray-500  flex items-center gap-1"
                  )}
                  onClick={async () => {
                    // Thêm nhạc vào playlist và phát nhạc
                    addMusicToTheFirst(
                      state,
                      dispatch,
                      musicdetail.id_music.toString(),
                      musicdetail.name,
                      musicdetail.url_path,
                      musicdetail.url_cover,
                      musicdetail.composer,
                      musicdetail.artists.map((artist) => artist.artist)
                    );

                    // Thêm vào lịch sử nghe nhạc
                    addMusicToHistory(musicdetail.id_music.toString(), 100);

                    // Dừng nhạc nếu đang phát và chọn lại nhạc
                    // if (
                    //   musicdetail.id_music ===
                    //     state?.currentPlaylist[0]?.id_music &&
                    //   state?.isPlaying
                    // ) {
                    //   dispatch({ type: "IS_PLAYING", payload: false });
                    // }
                  }}
                >
                  Phát nhạc
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="currentColor"
                    className="size-6 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                    />
                  </svg>
                </button>
              )}
              {!(
                state?.currentPlaylist?.[0]?.id_music !== musicdetail.id_music
              ) && (
                <button
                  className={clsx(
                    style.playButton,
                    "border border-gray-500 flex items-center gap-1"
                  )}
                  onClick={() =>
                    dispatch({ type: "IS_PLAYING", payload: !state?.isPlaying })
                  }
                >
                  Đang phát
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    fill="currentColor"
                    className="size-6 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                    />
                  </svg>
                </button>
              )}

              <span
                className={clsx(style.heartIcon, {
                  [style.heartIcon_active]: state?.favoriteMusic
                    .map((i) => i.id_music)
                    .includes(id),
                })}
                onClick={() => handleHeartClick(musicdetail.id_music)}
              >
                ♥
              </span>
            </div>
            <p className="font-normal text-[15px] text-gray-500 mb-1">
              Ca sĩ:{" "}
              {musicdetail.artists.map((i, index) => {
                return (
                  <Link
                    key={index}
                    href={"/artistdetail/" + i.id_music}
                    className="p-1 px-2 rounded-[100px] border border-gray-500 ml-2 inline-block"
                  >
                    {i.artist.name}
                  </Link>
                );
              })}
            </p>
            <p className="font-normal text-[15px] text-gray-500 mb-1">
              Thể loại:{" "}
              {musicdetail.types.map((i: any, index) => {
                return (
                  <Link
                    key={index}
                    href={"/type/" + i.type.id_type}
                    className="p-1 px-2 rounded-[100px] border border-gray-500 ml-2 inline-block"
                  >
                    {i.type.name}
                  </Link>
                );
              })}
            </p>
            <p className="font-normal text-[15px] text-gray-500 mb-1">
              {musicdetail.composer && "Sáng tác: " + musicdetail.composer}
            </p>
            <p className="font-normal text-[15px] text-gray-500 mb-1">
              Nhà sản xuất: {musicdetail.producer}
            </p>
            <p className="font-normal text-[15px] text-gray-500 mb-1">
              Ngày phát hành:{" "}
              {musicdetail.release_date
                ? formatTimeFromNow(musicdetail.release_date)
                : "Chưa có thông tin"}
            </p>
          </div>

          <div className="col-span-8">
            <p className="font-semibold !text-[32px] text-center mb-4">
              {musicdetail.name}
            </p>
            <div
              key={musicdetail.id_music}
              className="max-h-[440px] overflow-auto border-l border-r border-gray-800 shadow"
              ref={containerRef} // Gắn ref vào container chính
              style={{
                scrollbarWidth: "none",
                backgroundColor: "rgba(18, 18, 18, .4)",
              }}
            >
              {musicdetail?.lyrics.map((lyric, index) => {
                // Kiểm tra nếu currentDuration nằm trong khoảng start_time và end_time
                const isActive =
                  state?.currentDuration >= lyric.start_time &&
                  state?.currentDuration < lyric.end_time;

                if (id === state?.currentPlaylist?.[0]?.id_music) {
                  return (
                    <div
                      key={lyric.id_lyrics}
                      ref={(el) => (lyricsRefs.current[index] = el) as any} // Gắn ref vào mỗi lyric
                      className={`p-4 w-full text-left ${
                        isActive
                          ? "text-gray-200 font-medium rounded-full"
                          : "text-gray-500 bg-transparent font-normal"
                      }`}
                    >
                      {lyric.lyrics}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={lyric.id_lyrics}
                      ref={(el) => (lyricsRefs.current[index] = el) as any} // Gắn ref vào mỗi lyric
                      className={`p-4 w-full text-left text-gray-500 bg-transparent font-normal`}
                    >
                      {lyric.lyrics}
                    </div>
                  );
                }
              })}
            </div>
            <Comment id_music={id} />
          </div>
        </div>
        {/* <AlbumHot /> */}
      </div>
      <MusicPartner />
    </>
  );
};

export default SongDetailPage;
