import { useEffect, useState, useRef, useContext } from "react";
import axios from "@/lib/axios";
import style from "./listalbum.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import { addListMusicToTheFirst } from "../../musicplayer";
import { AppContext } from "@/app/layout";
import { log } from "console";
import clsx from "clsx";

interface Album {
  id_album: string;
  name: string;
  url_cover: string;
  created_at: string;
  musics: {
    id_music: string;
    name: string;
    url_path: string;
    url_cover: string;
    composer: string;
    id_composer: any;
    artists: {
      artist: {
        id_artist: string;
        name: string;
      };
    }[];
  }[];
}

export default function ListAlbum() {
  const [albumData, setAlbumData] = useState<Album[]>([]);
  const [favoriteAlbum, setFavoriteAlbum] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    axios
      .get("/album")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          const albumObj = response.result.data;
          setAlbumData(albumObj);
          //   console.log(albumObj);
        } else {
          console.error("Response result.data is undefined or null", response);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch album", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFavoriteAlbum(new Set(state?.favoriteAlbum.map((i) => i.id_album)));
  }, [state?.favoriteAlbum]);

  const handlePlayRandomClick = () => {
    if (isPlaying) {
      pausePlaying(); // Pause if currently playing
    } else {
      continuePlaying(); // Continue playing if paused
    }
  };

  const continuePlaying = () => {
    if (albumData.length > 0) {
      const randomAlbumIndex = Math.floor(Math.random() * albumData.length);
      const randomAlbum = albumData[randomAlbumIndex];
      if (randomAlbum.musics.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * randomAlbum.musics.length
        );
        const randomSong = randomAlbum.musics[randomIndex];
        setCurrentSong(randomSong);
        audioRef.current.src = randomSong.url_path; // Set audio source
        audioRef.current.play(); // Play the song
        setIsPlaying(true);
      } else {
        // console.log("No songs available to play.");
      }
    } else {
      //   console.log("No albums available to play.");
    }
  };

  const pausePlaying = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };
  const toggleFavorite: any = async (id_album: any) => {
    const isFavorite = favoriteAlbum.has(id_album);
    setFavoriteAlbum((prev) => {
      const updated = new Set(prev);
      if (isFavorite) {
        updated.delete(id_album);
        // alert("Yêu thích album thành công");
      } else {
        updated.add(id_album);
        // alert("Xóa yêu thích album thành công");
      }
      return updated;
    });

    const isLoggedIn = localStorage.getItem("accessToken"); // Thay đổi theo cách bạn lưu token
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để yêu thích bài hát!");
      dispatch({ type: "SHOW_LOGIN", payload: true });

      return;

      // if (typeof window !== "undefined") {

      //     const isLoggedIn = localStorage.getItem('accessToken'); // Thay đổi theo cách bạn lưu token
      //     if (!isLoggedIn) {
      //         alert('Vui lòng đăng nhập để yêu thích bài hát!');
      //         // router.push('/home');  // Chuyển hướng đến trang đăng nhập
      //         return;
      //     }
    }

    try {
      //   console.log(
      //     isFavorite ? "Xóa album khỏi yêu thích" : "Thêm album vào yêu thích"
      //   );
      if (isFavorite) {
        await axios.delete(`/favorite-album/me?id_album=${id_album}`);
      } else {
        await axios.post(`/favorite-album/me`, { id_album });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái yêu thích:", error);
      // Thông báo lỗi cho người dùng nếu cần
    }
  };

  return (
    <>
      <div className={style.headerSection}>
        <h2 className="home__heading">Album mới phát hành</h2>
        {/* <div className={style.all}>
          <a href="#" className={style.viewAllButton}>
            Tất cả
          </a>
          <ReactSVG className={style.csvg} src="/all.svg" />
        </div> */}
      </div>

      <div className={style.albumGrid}>
        {loading ? (
          <p>Đang tải album...</p>
        ) : (
          albumData
            .sort((a: any, b: any) => {
              return (
                new Date(a.created_date).getTime() -
                new Date(b.created_date).getTime()
              );
            })
            .slice(0, 5)
            .map((album) => (
              <div key={album.id_album} className={style.albumCard}>
                <div className={style.albumWrapper}>
                  <img
                    src={album.url_cover}
                    alt={album.name}
                    className={style.albumCover}
                  />
                  <div className={style.overlay}>
                    <button
                      className={style.likeButton}
                      onClick={() => toggleFavorite(album.id_album)}
                    >
                      <ReactSVG
                        src={
                          favoriteAlbum.has(album.id_album)
                            ? "/heart_active.svg"
                            : "/heart.svg"
                        }
                        className={clsx({
                          [style.activeHeart]: favoriteAlbum.has(
                            album.id_album
                          ),
                        })}
                      />
                    </button>
                    <button
                      className={style.playButton}
                      onClick={() => {
                        // console.log(album, "chúchsuchscschswkfwhbflwf");
                        let musicList = [];
                        album.musics.map((music) => {
                          musicList.push({
                            id_music: music?.id_music,
                            name: music?.name,
                            url_path: music?.url_path,
                            url_cover: music?.url_cover,
                            composer: music?.id_composer?.name,
                            artists: Array.isArray(music?.artists)
                              ? music.artists.map((artist) => {
                                  return {
                                    artist: {
                                      id_artist: artist.artist.id_artist,
                                      name: artist.artist.name,
                                    },
                                  };
                                })
                              : [],
                          });
                        });

                        addListMusicToTheFirst(state, dispatch, musicList);

                        if (
                          album.musics[0]?.id_music ===
                            state.currentPlaylist[0]?.id_music &&
                          state.isPlaying
                        ) {
                          dispatch({
                            type: "IS_PLAYING",
                            payload: false,
                          });
                        }
                      }}
                    >
                      <i className="fas fa-play"></i>
                    </button>
                    {/* <button className={style.moreButton}>
                      <ReactSVG src="/more.svg" />
                    </button> */}
                  </div>
                </div>
                <Link
                  href={`/albumdetail/${album.id_album}`}
                  className={style.albumTitle}
                >
                  {album.name}
                </Link>
              </div>
            ))
        )}
        <audio ref={audioRef} />
      </div>
    </>
  );
}
