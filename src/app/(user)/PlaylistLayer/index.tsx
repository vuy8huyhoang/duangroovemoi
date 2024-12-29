"use client";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../layout";
import axios from "@/lib/axios";

const PlaylistLayer = () => {
  const { state, dispatch } = useContext(AppContext);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);

  useEffect(() => {
    if (state?.playlistLayer && state?.playlistLayer !== "add") {
      axios.get("playlist/me").then((res: any) => {
        setCurrentPlaylist(res.result.data);
        console.log(res.result.data);
      });
    }
  }, [state?.playlistLayer]);

  const handleSubmitAddForm = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("playlist/me", { name })
      .then((res: any) => {
        alert("Thêm playlist thành công");
        dispatch({ type: "PLAYLIST_LAYER", payload: "" });
        setLoading(false);
      })
      .catch(() => {
        alert("Thêm playlist không thành công");
        setLoading(false);
      });
  };

  const handleCheckboxChange = (playlistId, isChecked) => {
    setLoading(true);
    if (isChecked) {
      // Add song to playlist
      axios
        .post(`playlist/add-music`, {
          id_playlist: playlistId,
          id_music: state.playlistLayer,
        })

        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
      setCurrentPlaylist((prev) =>
        prev.map((playlist) =>
          playlist.id_playlist === playlistId
            ? {
                ...playlist,
                musics: [
                  ...playlist.musics,
                  { id_music: state?.playlistLayer },
                ],
              }
            : playlist
        )
      );
    } else {
      // Remove song from playlist
      axios
        .delete(
          `playlist/add-music?id_music=${state?.playlistLayer}&id_playlist=${playlistId}`
        )
        .then(() => {
          setLoading(false);
          setCurrentPlaylist((prev) =>
            prev.map((playlist) =>
              playlist.id_playlist === playlistId
                ? {
                    ...playlist,
                    musics: playlist.musics.filter(
                      (music) => music.id_music !== state?.playlistLayer
                    ),
                  }
                : playlist
            )
          );
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  if (!state?.playlistLayer) return <></>;
  if (state?.playlistLayer === "add") {
    return (
      <form
        className="fixed top-1/2 left-1/2 bg-gray-100 z-50 py-[30px] px-[20px] rounded-[10px] backdrop-blur-[6px] flex flex-col gap-3 w-[350px]"
        style={{
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(18, 18, 18,.9)",
        }}
        onSubmit={(e) => handleSubmitAddForm(e)}
      >
        <button
          className="absolute top-[10px] right-[4px]"
          type="button"
          onClick={() => dispatch({ type: "PLAYLIST_LAYER", payload: "" })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#ccc"
            className="size-6 w-[20px]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-gray-200 font-medium text-[18px]">
          Thêm mới playlist
        </h2>
        <input
          type="text"
          placeholder="Tên..."
          required
          className="px-[20px] py-[10px] rounded-[100px] text-gray-300 font-normal text-[14px] outline-none placeholder:text-gray-400 h-[40px] placeholder:font-normal w-full"
          style={{ backgroundColor: "rgba(255, 255, 255, .05)" }}
          value={name}
          name="name"
          id="name"
          onChange={(e) => setName(e.target.value)}
        />
        <button className="h-[40px] bg-[#a155f1] text-white rounded-[100px] mb-[20px] text-[14px] text-gray-300 font-medium">
          {loading ? "Đang gửi" : "Thêm"}
        </button>
      </form>
    );
  }

  return (
    <div
      className="fixed top-1/2 left-1/2 bg-gray-100 z-50 py-[30px] px-[20px] rounded-[10px] backdrop-blur-[6px] flex flex-col gap-3 h-[350px] w-[400px]"
      style={{
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(18, 18, 18,.9)",
      }}
    >
      <button
        className="absolute top-[10px] right-[4px]"
        type="button"
        onClick={() => dispatch({ type: "PLAYLIST_LAYER", payload: "" })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#ccc"
          className="size-6 w-[20px]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h2 className="text-white font-semibold text-lg text-center">
        Thêm bài hát vào...
      </h2>
      <div className="max-h-72 overflow-y-auto flex flex-col gap-3">
        {currentPlaylist.map((playlist, index) => {
          const isChecked = playlist.musics
            .map((i) => i.id_music)
            .includes(state?.playlistLayer);

          return (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`${playlist.name}-${index}`}
                name={`${playlist.name}-${index}`}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                checked={isChecked}
                onChange={() =>
                  handleCheckboxChange(playlist.id_playlist, !isChecked)
                }
              />
              <label
                htmlFor={`${playlist.name}-${index}`}
                className="text-gray-300 text-sm cursor-pointer flex-1"
              >
                {playlist.name}
              </label>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="py-2 px-4 mt-3 rounded-full text-white bg-transparent hover:bg-gray-500 transition-all duration-200 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50"
        onClick={() => dispatch({ type: "PLAYLIST_LAYER", payload: "add" })}
      >
        Thêm mới playlist
      </button>
    </div>
  );
};

export default PlaylistLayer;
