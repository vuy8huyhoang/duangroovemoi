"use client"; // Thêm dòng này để đánh dấu là Client Component

import React, { useContext, useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./playlist.module.scss";
import { ReactSVG } from "react-svg";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/layout";
import clsx from "clsx";
import { Img } from "react-image";
import Link from "next/link";

interface Playlist {
  id_playlist: string;

  name: string;
  musics: Music[];
  playlist_index: number; // Thêm tên người tạo vào dữ liệu playlist
}
interface Music {
  id_music: string;
  name: string;
  producer: string;
  url_path: string;
  url_cover: string;
  total_duration: string | null;
}

const PlaylistPage = () => {
  const router = useRouter();
  // const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { state, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  // const [newPlaylistIndex, setNewPlaylistIndex] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<string | number>("none");

  const fetchPlaylists = async () => {
    if (state?.profile && state?.profile?.is_vip === 1) {
      // try {
      //   const response: any = await axios.get("/playlist/me");
      //   const data = response.result;
      //   // console.log("toàn bộ dữ liệu:", response);
      //   if (data && data.data) {
      //     setPlaylists(data.data);
      //   } else {
      //     setError("No playlists found");
      //   }
      // } catch (error: any) {
      //   setError(error.message || "Failed to fetch playlists");
      // } finally {
      // }
    }
    setLoading(false);
  };

  const deletePlaylist = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa playlist này?")) {
      return; // Người dùng hủy xóa
    }

    const id_playlist = state?.playlist?.[activePlaylist]?.id_playlist;

    try {
      const response: any = await axios.delete(
        `/playlist/me?id_playlist=${id_playlist}`
      );

      if (response.status === 200) {
        // Xóa thành công
        // setPlaylists((prev) =>
        //   prev.filter((playlist) => playlist.id_playlist !== id_playlist)
        // );
        dispatch({
          type: "PLAYLIST",
          payload: state?.playlist.filter((i) => i.id_playlist !== id_playlist),
        });
        setActivePlaylist("none");
      } else {
        // Thông báo nếu xóa thất bại
        console.error("Error deleting playlist:", response.result.message);
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      alert("Đã xảy ra lỗi khi xóa playlist!");
    }
  };

  const toggleMenu = (id: string) => {
    setShowMenuId(showMenuId === id ? null : id);
  };

  useEffect(() => {
    fetchPlaylists();
  }, [state?.profile]);

  if (loading) return <p>Loading...</p>;

  const handleRemoveMusic = (id_music) => {
    axios
      .delete(
        `playlist/add-music?id_music=${id_music}&id_playlist=${state?.playlist?.[activePlaylist]?.id_playlist}`
      )
      .then(() => {
        setLoading(false);
        dispatch({
          type: "PLAYLIST",
          payload: state?.playlist.map((playlist) =>
            playlist.id_playlist ===
            state?.playlist?.[activePlaylist]?.id_playlist
              ? {
                  ...playlist,
                  musics: playlist.musics.filter(
                    (music) => music.id_music !== id_music
                  ),
                }
              : playlist
          ),
        });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className={style.playlistPage}>
      <h1 className="home__heading">Playlist</h1>

      <div className="grid grid-cols-12 gap-4 flex-wrap">
        {/* Nút để mở modal tạo playlist */}

        <div
          className={clsx("grid grid-cols-12 gap-4 items-start", {
            "col-span-8": activePlaylist !== "none",
            "col-span-12": activePlaylist === "none",
          })}
        >
          <button
            className={clsx(
              style.playlistItem,
              style.playlistItem__center,
              "min-h-[150px] mt-4",
              {
                "col-span-3": activePlaylist !== "none",
                "col-span-2": activePlaylist === "none",
              }
            )}
            onClick={() => {
              if (state?.profile?.is_vip !== 1)
                dispatch({ type: "SHOW_VIP", payload: true });
              else dispatch({ type: "PLAYLIST_LAYER", payload: "add" });
            }}
          >
            <ReactSVG className={style.csvg} src="/Group 282.svg" />
            <p className="text-[14px] text-gray-300 font-normal">
              Tạo playlist mới
            </p>
          </button>

          {state?.playlist
            .sort((a, b) => b.playlist_index - a.playlist_index)
            .map((playlist, index) => (
              <button
                key={playlist.id_playlist}
                className={clsx(
                  "col-span-2 flex flex-col items-center justify-start",
                  {
                    [style.activePlaylist]: index === activePlaylist,
                    "col-span-3": activePlaylist !== "none",
                    "col-span-2": activePlaylist === "none",
                  }
                )}
                onClick={() => {
                  if (index === activePlaylist) {
                    setActivePlaylist("none");
                  } else {
                    setActivePlaylist(index);
                  }
                }}
              >
                <img
                  src="/default.png"
                  alt="Playlist cover"
                  className="!rounded-full w-[80%]"
                />
                <p className="text-[14px] font-normal mt-[10px] text-gray-400">
                  {playlist.name}
                </p>
                {/* Dấu ba chấm */}
                {/* <div className={style.menuWrapper}>
                  <button
                    className={style.menuButton}
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                      toggleMenu(playlist.id_playlist);
                    }}
                  >
                    &#8942;
                  </button>
                </div> */}
              </button>
            ))}
        </div>

        {activePlaylist !== "none" && (
          <div className="col-span-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">
                Bài hát trong "{state?.playlist?.[activePlaylist].name}"
              </h2>
              <button
                className="text-red-800 font-normal text-[12px]"
                onClick={deletePlaylist}
              >
                Xóa playlist
              </button>
            </div>
            <div>
              {state?.playlist?.[activePlaylist].musics.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-gray-500 text-sm">Chưa có bài hát nào</p>
                </div>
              ) : (
                <div>
                  {state?.playlist?.[activePlaylist].musics.map(
                    (music, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-4 items-center p-3 rounded-md hover:bg-gray-800 transition group"
                      >
                        <Img
                          src={music.url_cover}
                          alt={music.name}
                          className="col-span-3 w-full h-full aspect-square object-cover rounded"
                          unloader={
                            <img
                              src="/default.png"
                              alt="default"
                              className="w-full h-full aspect-square object-cover rounded-full"
                            />
                          }
                        />
                        <Link
                          href={"/musicdetail/" + music.id_music}
                          className="col-span-8"
                        >
                          <div className="text-white font-medium truncate">
                            {music.name}
                          </div>
                          <p className="text-gray-400 text-sm truncate">
                            {music?.artists
                              ?.map((artist) => artist.artist.name)
                              .join(", ")}
                          </p>
                        </Link>
                        <button
                          onClick={() => handleRemoveMusic(music.id_music)}
                          className="col-span-1 text-red-800 font-normal text-[12px] hidden group-hover:block"
                        >
                          Xóa
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
