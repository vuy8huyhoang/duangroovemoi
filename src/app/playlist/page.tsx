"use client"; // Thêm dòng này để đánh dấu là Client Component

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./playlist.module.scss";
import { ReactSVG } from "react-svg";

interface Playlist {
  id_playlist: string;
  name: string;
  
  creator_name: string; // Thêm tên người tạo vào dữ liệu playlist
   
}


const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all"); // Tab quản lý
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creating, setCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  

  const fetchPlaylists = async () => {
    try {
      const response:any = await axios.get("/playlist/me");
      const data = response.result;

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
    if (!newPlaylistName) {
      setError("Playlist name cannot be empty");
      return;
    }
  
    setCreating(true);
    try {
      // Gửi yêu cầu tạo playlist
      const response: any = await axios.post("/playlist/me", {
        name: newPlaylistName,
      });
  
      // Kiểm tra và log phản hồi
      console.log("API Response:", response);
  
      if (response && response.result && response.result.data) {
        const { success , message } = response.result;
  
        if (success) {
          // Nếu thành công, reset các trường và fetch lại playlist
          setNewPlaylistName("");
          
          setIsModalOpen(false);
          fetchPlaylists();
        } else {
          // Nếu phản hồi không thành công, hiển thị thông báo lỗi
          setError(message || "Failed to create playlist");
        }
      } else {
        // Nếu không có dữ liệu trong phản hồi, hiển thị lỗi
        setError("Unexpected response format");
      }
    } catch (error: any) {
      // Xử lý lỗi mạng hoặc các lỗi khác
      if (axios(error)) {
        console.error("Axios Error:", error);  // Log lỗi Axios
        setError(error.response?.result?.message || error.message || "An error occurred while creating playlist");
      } else {
        console.error("Unknown Error:", error);  // Log lỗi không phải từ Axios
        setError("An unknown error occurred");
      }
    } finally {
      setCreating(false); // Đặt trạng thái tạo playlist về false khi hoàn thành
    }
  };
  

  
  

  

  useEffect(() => {
    fetchPlaylists();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={style.playlistPage}>
      <h1 className={style.title}>Playlist</h1>

      {/* Tabs chuyển đổi giữa "Tất cả" và "Của tôi" */}
      <div className={style.tabs}>
        <button
          className={`${style.tabButton} ${activeTab === "all" ? style.active : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả
        </button>
        <button
          className={`${style.tabButton} ${activeTab === "mine" ? style.active : ""}`}
          onClick={() => setActiveTab("mine")}
        >
          Của tôi
        </button>
      </div>

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
              


              <button onClick={createPlaylist} disabled={creating}>
                {creating ? "Creating..." : "Tạo playlist"}
              </button>
              <button onClick={() => setIsModalOpen(false)}>Đóng</button>
            </div>
          </div>
        )}

        {playlists.map((playlist) => (
          <div key={playlist.id_playlist} className={style.playlistItem}>
            <img src="/playlist.png" alt="Playlist cover" />
            <p>{playlist.name}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistPage;
