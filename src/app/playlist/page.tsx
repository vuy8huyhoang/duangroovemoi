"use client"; // Thêm dòng này để đánh dấu là Client Component

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./playlist.module.scss";
import { ReactSVG } from "react-svg";
import { useRouter } from "next/navigation";

interface Playlist {
  id_playlist: string;
  
  name: string;
  musics: Music[];
  playlist_index: number // Thêm tên người tạo vào dữ liệu playlist
   
}
interface Music {
  id_music: string;
  name: string;
  producer:string;
  url_path: string;
  url_cover: string;
  total_duration: string | null;
}


const PlaylistPage = () => {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newPlaylistName, setNewPlaylistName] = useState("");
  // const [newPlaylistIndex, setNewPlaylistIndex] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  const [showMenuId, setShowMenuId] = useState<string | null>(null);

  

  const fetchPlaylists = async () => {
    try {
      const response:any = await axios.get("/playlist/me");
      const data = response.result;
      console.log("toàn bộ dữ liệu:", response);
      

      if (data && data.data) {
        setPlaylists(data.data);
      } else {
        setError("No playlists found");
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch playlists");
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName || !newPlaylistName.replace(/\s/g, "")) {
      setError("Vui lòng nhập tên playlist");
      // alert("Vui lòng nhập tên playlist")
      // return;
    }else{

  
    setCreating(true);
    setError(null);
    try {
      // Tự động tính toán playlist_index dựa trên số lượng playlist hiện tại
      const playlistIndex = playlists.length + 1;
      // Gửi yêu cầu tạo playlist
      const response: any = await axios.post("/playlist/me", {
        name: newPlaylistName,
        playlist_index: playlistIndex,
      });
  
      // Kiểm tra và log phản hồi
      console.log("API Response:", response);
  
      if (response && response.result && response.result.newID) {
        const {   message } = response.result;
        const status = response.status  
        console.log("test success:",status);
        
        if (status === 201) {
          // Nếu thành công, reset các trường và fetch lại playlist
          setNewPlaylistName("");
          
          setIsModalOpen(false);
          fetchPlaylists();
        } else {
          // Nếu phản hồi không thành công, hiển thị thông báo lỗi
          setError(message || "Tạo playlist thất bại");
        }
      } 
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi khi tạo playlist");
    } finally {
      setCreating(false); // Đặt trạng thái tạo playlist về false khi hoàn thành
    } 
  }
  };

  const deletePlaylist = async (e, id_playlist: string,) => {
    e.stopPropagation()
    if (!window.confirm("Bạn có chắc chắn muốn xóa playlist này?")) {
        return; // Người dùng hủy xóa
    }

    try {
        const response:any = await axios.delete(`/playlist/me?id_playlist=${id_playlist}`);

        if (response.status === 200) {
            // Xóa thành công
            setPlaylists((prev) => prev.filter((playlist) => playlist.id_playlist !== id_playlist));
            alert("Xóa playlist thành công!");
        } else {
            // Thông báo nếu xóa thất bại
            console.error("Error deleting playlist:", response.result.message);
            alert("Xóa playlist thất bại!");
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
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={style.playlistPage}>
      <h1 className={style.title}>Playlist</h1>

      

      <div className={style.playlistGrid}>
        {/* Nút để mở modal tạo playlist */}
        <div className={style.playlistItem} onClick={() =>  setIsModalOpen(true) }>
        <ReactSVG className={style.csvg} src="/Group 282.svg" />
          <p>Tạo playlist mới</p>
        </div>

        {/* Modal để nhập tên playlist */}
        {isModalOpen && (
          <div className={style.modal}>
            <div className={style.modalContent}>
              <h2>Tạo Playlist Mới</h2>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Tên playlist mới"
              />
              {error &&(
              <p className={style.error}>{error}</p>
              )}
              {/* <input
                type="number"
                value={newPlaylistIndex || ""}
                onChange={(e) => setNewPlaylistIndex(Number(e.target.value))}
                placeholder="Playlist Index"
              /> */}
              


              <button onClick={createPlaylist} >
                {creating ? "Creating..." : "Tạo playlist"}
              </button>
              <button onClick={() => setIsModalOpen(false)}>Đóng</button>
            </div>
          </div>
        )}

        
        {playlists.sort((a,b) => b.playlist_index - a.playlist_index).map((playlist) => (
          <div key={playlist.id_playlist} className={style.playlistItem}
          onClick={() => router.push(`/playlist/${playlist.id_playlist}`)}>
            <img src="/playlist.png" alt="Playlist cover" />

            <p>{playlist.name}</p>

            {/* Dấu ba chấm */}
            <div className={style.menuWrapper}>
              <button
                className={style.menuButton}
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                  toggleMenu(playlist.id_playlist);
                }}
              >
                &#8942;
              </button>

              {/* Menu khi click vào dấu ba chấm */}
              {showMenuId === playlist.id_playlist && (
                <div className={style.menu}>
                  <button
                    onClick={(e) => deletePlaylist(e, playlist.id_playlist)}
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistPage;
