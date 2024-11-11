"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "./AdminMusic.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";

interface Artist {
  id_artist: string;
  name: string;
  slug: string;
  url_cover: string;
}
interface Song {
  id_music: string;
  name: string;
  composer: string;
  releaseDate: string;
  created_at: string;
  producer: string;
  url_cover: string;
  url_path: string;
  is_show: number;

  artists: {
    artist: Artist;
  }[];
}

export default function AdminMusic() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const songsPerPage = 10;

  useEffect(() => {
    axios
      .get("/music")
      .then((response: any) => {
        console.log("Full API response:", response);
        if (response && response.result && response.result.data) {
          setSongs(response.result.data);
        } else {
          console.error("Response data is undefined or empty:", response);
          setSongs([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch bài hát:", error);
        setSongs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDeleteSong = async (id_music: string, url: string) => {
    try {
      await axios.delete(`/music/${id_music}`);
      setSongs(songs.filter((song) => song.id_music !== id_music));
      await axios.delete(`/upload-image?url=${url}`);
      await axios.delete(`/upload-audio?url=${url}`);
    } catch (error) {
      console.error("Lỗi xóa bài hát:", error);
    }
  };

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);
  const totalPages = Math.ceil(songs.length / songsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý bài hát</h1>
        <Link href="/admin/addmusic" passHref>
          <button className={styles.addButton}>
            <ReactSVG className={styles.csvg} src="/plus.svg" />
            <div className={styles.addText}>Tạo bài hát mới</div>
          </button>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.songTable}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên bài hát</th>
              <th>Ca sĩ</th>
              <th>Ngày tạo</th>
              <th>Nhà sản xuất</th>
              <th>Ẩn hiện</th>
              <th>Tính năng</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className={styles.loading}>
                  Đang tải...
                </td>
              </tr>
            ) : (
              currentSongs.map((song) => (
                <tr key={song.id_music}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>#{song.id_music}</td>
                  <td>
                    <img src={song.url_cover} alt="" />
                  </td>
                  <td>{song.name}</td>
                  <td>
                    {song.artists
                      .slice(0, 3)
                      .map((artistWrapper) => artistWrapper.artist.name)}
                  </td>

                  <td>
                    {new Date(song.created_at).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td>{song.producer}</td>
                  <td>{song.is_show == 1 ? "Hiện" : "Ẩn"}</td>

                  <td className={styles.actions}>
                    <button className={styles.editButton}>
                      <Link href={`/admin/editmusic/${song.id_music}`} passHref>
                        <ReactSVG
                          className={styles.csvg}
                          src="/Rectangle 80.svg"
                        />
                      </Link>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() =>
                        handleDeleteSong(
                          song.id_music,
                          song.url_cover || song.url_path
                        )
                      }
                    >
                      <ReactSVG
                        className={styles.csvg}
                        src="/Rectangle 79.svg"
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? styles.activePage : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
