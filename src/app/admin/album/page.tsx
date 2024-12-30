"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "../tables.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import { Img } from "react-image";

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
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOption === "oldest") {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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
      <div className={styles.tableContainer}>
        <div className={styles.header}>
          <div className="flex gap-4 items-center">
            <h1 className="font-bold text-2xl">Quản lý Album</h1>
            <div className={styles.searchContainer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>

              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
          <Link href="/admin/album/add" passHref>
            <button className={styles.addButton}>
              <ReactSVG className={styles.csvg} src="/plus.svg" />
              <div className={styles.addText}>Tạo album mới</div>
            </button>
          </Link>
        </div>
        <div className="flex gap-4 mt-4 justify-between">
          <div className="flex gap-4">
            <div className={styles.paginationControl}>
              <label htmlFor="albumsPerPage">Số lượng:</label>
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
                <option value="latest">Ngày tạo (Mới nhất)</option>
                <option value="oldest">Ngày tạo (Cũ nhất)</option>
                <option value="nameAsc">Tên album (A-Z)</option>
                <option value="nameDesc">Tên album (Z-A)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            {/* Nút chuyển đến trang trước */}
            {currentPage > 1 && (
              <button
                onClick={() => paginate(currentPage - 1)}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                &laquo;
              </button>
            )}

            {/* Trang đầu tiên */}
            <button
              onClick={() => paginate(1)}
              className={`px-3 py-1 text-sm font-medium rounded ${
                currentPage === 1
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 bg-gray-200 hover:bg-gray-300"
              }`}
            >
              1
            </button>

            {/* Dấu "..." nếu cần */}
            {currentPage > 4 && (
              <span className="px-3 py-1 text-sm text-gray-500">...</span>
            )}

            {/* Hiển thị các trang xung quanh trang hiện tại */}
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page !== 1 &&
                page !== totalPages &&
                page >= currentPage - 2 &&
                page <= currentPage + 2
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}

            {/* Dấu "..." nếu cần */}
            {currentPage < totalPages - 3 && (
              <span className="px-3 py-1 text-sm text-gray-500">...</span>
            )}

            {/* Trang cuối */}
            {totalPages > 1 && (
              <button
                onClick={() => paginate(totalPages)}
                className={`px-3 py-1 text-sm font-medium rounded ${
                  currentPage === totalPages
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {totalPages}
              </button>
            )}

            {/* Nút chuyển đến trang sau */}
            {currentPage < totalPages && (
              <button
                onClick={() => paginate(currentPage + 1)}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                &raquo;
              </button>
            )}
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên album</th>
              <th>Nghệ sĩ</th>
              <th>Ngày tạo</th>
              <th>Bài hát</th>
              <th>Trạng thái</th>
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
                  <td className="flex justify-center">
                    <Img
                      src={album.url_cover}
                      alt={album.name}
                      unloader={<img src="/default.png" />}
                    />
                  </td>
                  <td>{album.name}</td>
                  <td>{album.artist.name}</td>
                  <td className="text-center">
                    {new Date(album.created_at).toLocaleString("vi-VN", {
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
                  <td className="text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-regular ${
                        album.is_show === 0
                          ? "bg-red-200 text-red-600"
                          : "bg-green-200 text-green-600"
                      }`}
                    >
                      {album.is_show === 0 ? "Ẩn" : "Hiện"}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.editButton}>
                      <Link
                        href={`/admin/album/edit/${album.id_album}`}
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
    </div>
  );
}
