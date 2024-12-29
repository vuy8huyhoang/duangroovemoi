"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "../tables.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";

interface Music {
  id_music: string;
  name: string;
  url_path: string;
}

interface Artist {
  id_artist: string;
  name: string;
}

interface Album {
  id_album: string;
  name: string;
  release_date: string;
  created_at: string;
  is_show: number;
  url_cover: string;
  artist: Artist;
  musics: Music[];
}

export default function AdminAlbum() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("latest");
  const [albumsPerPage, setAlbumsPerPage] = useState<number>(10);

  const filteredAlbums = albums.filter(
    (album) =>
      album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAlbums = filteredAlbums.sort((a, b) => {
    if (sortOption === "latest") {
      return (
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      );
    } else if (sortOption === "oldest") {
      return (
        new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
      );
    } else if (sortOption === "nameAsc") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "nameDesc") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = sortedAlbums.slice(indexOfFirstAlbum, indexOfLastAlbum);
  const totalPages = Math.ceil(filteredAlbums.length / albumsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    axios
      .get("/album")
      .then((response: any) => {
        // console.log("Full API response:", response);
        if (response && response.result && response.result.data) {
          setAlbums(response.result.data);
        } else {
          console.error("Response data is undefined or empty:", response);
          setAlbums([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch album:", error);
        setAlbums([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDeleteAlbum = async (id_album: string) => {
    try {
      await axios.delete(`/album/${id_album}`);
      setAlbums(albums.filter((album) => album.id_album !== id_album));
    } catch (error) {
      console.error("Lỗi xóa album:", error);
    }
  };

  const handleToggleVisibility = async (id_album: string, is_show: number) => {
    try {
      const updatedAlbum = { is_show: is_show === 1 ? 0 : 1 };
      await axios.put(`/album/${id_album}`, updatedAlbum);
      setAlbums((prevAlbums) =>
        prevAlbums.map((album) =>
          album.id_album === id_album
            ? { ...album, is_show: updatedAlbum.is_show }
            : album
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái ẩn/hiện album:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý Album</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm album"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.paginationControl}>
          <label htmlFor="albumsPerPage">Số album trên một trang:</label>
          <select
            id="albumsPerPage"
            value={albumsPerPage}
            onChange={(e) => setAlbumsPerPage(Number(e.target.value))}
            className={styles.paginationSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className={styles.sortContainer}>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="latest">Ngày phát hành (Mới nhất)</option>
            <option value="oldest">Ngày phát hành (Cũ nhất)</option>
            <option value="nameAsc">Tên album (A-Z)</option>
            <option value="nameDesc">Tên album (Z-A)</option>
          </select>
        </div>
        <Link href="/admin/addalbum" passHref>
          <button className={styles.addButton}>
            <ReactSVG className={styles.csvg} src="/plus.svg" />
            <div className={styles.addText}>Tạo album mới</div>
          </button>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.albumTable}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên album</th>
              <th>Nghệ sĩ</th>
              <th>Ngày phát hành</th>
              <th>Bài hát</th>
              <th>Ẩn/Hiện</th>
              <th>Tính năng</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className={styles.loading}>
                  Đang tải...
                </td>
              </tr>
            ) : (
              currentAlbums.map((album) => (
                <tr key={album.id_album}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>#{album.id_album}</td>
                  <td>
                    <img src={album.url_cover} alt={album.name} />
                  </td>
                  <td>{album.name}</td>
                  <td>{album.artist.name}</td>
                  <td>
                    {new Date(album.release_date).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td>
                    <ul className={styles.songList}>
                      {album.musics.map((music) => (
                        <li key={music.id_music}>
                          <a
                            href={music.url_path}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {music.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button
                      className={
                        album.is_show === 1
                          ? styles.showButton
                          : styles.hideButton
                      }
                      onClick={() =>
                        handleToggleVisibility(album.id_album, album.is_show)
                      }
                    >
                      {album.is_show === 1 ? "Hiện" : "Ẩn"}
                    </button>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.editButton}>
                      <Link
                        href={`/admin/editalbum/${album.id_album}`}
                        passHref
                      >
                        <ReactSVG
                          className={styles.csvg}
                          src="/Rectangle 80.svg"
                        />
                      </Link>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteAlbum(album.id_album)}
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
