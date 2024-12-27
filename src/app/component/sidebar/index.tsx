"use client";
import { useState, useEffect, useContext } from "react";
import styles from "./sidebar.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import axios from "@/lib/axios";
import { AppContext } from "@/app/layout";

interface Playlist {
  id_playlist: string;
  id_music: string;
  name: string;

  playlist_index: number; // Thêm tên người tạo vào dữ liệu playlist
}

export default function Sidebar() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeItem, setActiveItem] = useState<string>("Khám Phá");
  const [error, setError] = useState<string | null>(null);
  const { state, dispatch } = useContext(AppContext);
  const [creating, setCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const pathname = usePathname();

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      alert("Vui lòng nhập tên playlist");
      setError("Tên playlist không được để trống");
      return;
    }

    setCreating(true);
    try {
      // Tự động tính toán playlist_index dựa trên số lượng playlist hiện tại
      const playlistIndex = playlists.length + 1;
      // Gửi yêu cầu tạo playlist
      const response: any = await axios.post("/playlist/me", {
        name: newPlaylistName,
        playlist_index: playlistIndex,
      });

      // Kiểm tra và log phản hồi
      // console.log("API Response:", response);

      if (response && response.result && response.result.newID) {
        const { message } = response.result;
        const status = response.status;
        // console.log("test success:", status);

        if (status === 201) {
          // Nếu thành công, reset các trường và fetch lại playlist
          setNewPlaylistName("");

          setIsModalOpen(false);
        } else {
          // Nếu phản hồi không thành công, hiển thị thông báo lỗi
          setError(message || "Failed to create playlist");
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch playlists");
    } finally {
      setCreating(false); // Đặt trạng thái tạo playlist về false khi hoàn thành
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/logo.svg" alt="Groove Logo" />
        </Link>
      </div>
      <ul className={styles.menu}>
        <li>
          <Link
            href="/thuvien"
            className={clsx(styles.menuItem, {
              [styles.active]: pathname === "/thuvien",
            })}
          >
            <ReactSVG className={styles.csvg} src="/Group (1).svg" />
            <span>Thư Viện</span>
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className={clsx(styles.menuItem, {
              [styles.active]: pathname === "/",
            })}
          >
            <ReactSVG className={styles.csvg} src="/earth_light.svg" />
            <span>Khám Phá</span>
          </Link>
        </li>
        <li>
          <Link
            href="/groovechart"
            className={clsx(styles.menuItem, {
              [styles.active]: pathname === "/groovechart",
            })}
          >
            <ReactSVG className={styles.csvg} src="/Vector (1).svg" />
            <span>Bảng xếp hạng</span>
          </Link>
        </li>

        <li>
          <Link
            href="/type"
            className={clsx(styles.menuItem, {
              [styles.active]: pathname === "/type",
            })}
          >
            <ReactSVG className={styles.csvg} src="/type_light.svg" />
            <span>Chủ Đề & Thể Loại</span>
          </Link>
        </li>
      </ul>
      <ul className={styles.submenu}>
        <li>
          <Link
            href="/historymusic"
            className={clsx(styles.menuItem, {
              [styles.active]: pathname === "/historymusic",
            })}
          >
            <ReactSVG className={styles.csvg} src="/history.svg" />
            <span>Nghe gần đây</span>
          </Link>
        </li>
        {state?.profile?.is_vip != 1 && (
          <button
            className="px-[20px] mt-[20px]"
            onClick={() => {
              if (!state?.profile)
                dispatch({ type: "SHOW_LOGIN", payload: true });
              if (state?.profile) dispatch({ type: "SHOW_VIP", payload: true });
            }}
          >
            <div className={styles.updateBox}>
              <div
                className={clsx(
                  "flex justify-center items-center",
                  styles.content
                )}
              >
                <span>Tải về các bài hát yêu thích, tạo playlist cá nhân</span>
                {/* <ReactSVG src="/crown.svg"></ReactSVG> */}
              </div>
              <div className={styles.btn}>Nâng cấp tài khoản</div>
            </div>
          </button>
        )}
        {/* <li>
          <Link
            href="/thuvien/favorites"
            className={clsx(styles.menuItem, {
              [styles.active]: pathname === "/thuvien/favorites",
            })}
          >
            <ReactSVG className={styles.csvg} src="/Frame 10 (1).svg" />
            <span>Bài hát yêu thích</span>
          </Link>
        </li>
        <li>
          <Link
            href="/thuvien/playlist"
            className={clsx(styles.menuItem, {
              [styles.active]: pathname === "/thuvien/playlist",
            })}
          >
            <ReactSVG className={styles.csvg} src="/Frame 10 (2).svg" />
            <span>Playlist</span>
          </Link>
        </li>
        <li>
          <Link
            href="/thuvien/album"
            className={clsx(styles.menuItem, {
              [styles.active]: pathname === "/thuvien/album",
            })}
          >
            <ReactSVG className={styles.csvg} src="/Frame 10 (3).svg" />
            <span>Album</span>
          </Link>
        </li> */}
      </ul>
      <div className={styles.createPlaylist}>
        <button
          onClick={() => {
            if (!state?.profile) {
              dispatch({ type: "SHOW_LOGIN", payload: true });
            } else if (state?.profile?.is_vip !== 1) {
              dispatch({ type: "SHOW_VIP", payload: true });
            } else {
              dispatch({ type: "PLAYLIST_LAYER", payload: "add" });
            }
          }}
        >
          <ReactSVG src="/vector (3).svg" />
          <span className="text-[14px]">Tạo playlist mới</span>
        </button>
      </div>
    </div>
  );
}
