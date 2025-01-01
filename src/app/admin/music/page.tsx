"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "../tables.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import { Img } from "react-image";
import { exportToExcel } from "@/utils/files";

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
  index: number;

  artists: {
    artist: Artist;
  }[];
}

export default function AdminMusic() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("latest");
  const [songsPerPage, setSongsPerPage] = useState<number>(10);
  const [select, setSelect] = useState([]);

  const filteredSongs = songs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artists.some((artistWrapper) =>
        artistWrapper.artist.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
  );

  const sortedSongs = filteredSongs.sort((a, b) => {
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

  const fetch = () => {
    setLoading(true);
    axios
      .get("/music")
      .then((response: any) => {
        // console.log("Full API response:", response);
        if (response && response.result && response.result.data) {
          // console.log(response.result.data);

          setSongs(
            response.result.data.map((i, index) => {
              return { ...i, index };
            })
          );
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
  };

  useEffect(() => {
    fetch();
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
  const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);
  const totalPages = Math.ceil(songs.length / songsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  function isArrayComplete(arr, n): boolean {
    const uniqueSet = new Set(arr); // Loại bỏ trùng lặp
    if (uniqueSet.size !== n + 1) return false; // Số lượng phải đúng
    for (let i = 0; i < n; i++) {
      if (!uniqueSet.has(i)) return false; // Kiểm tra từng số
    }
    return true;
  }

  function createArrayFromZeroToN(n) {
    return Array.from({ length: n + 1 }, (_, i) => i);
  }

  const toggleSelectAll = () => {
    const n = songs.length;
    if (isArrayComplete(select, n - 1)) {
      setSelect([]);
    } else {
      setSelect(createArrayFromZeroToN(n - 1));
    }
  };

  const toggleSelect = (num) => {
    if (select.includes(num)) {
      setSelect((prev) => {
        return prev.filter((i) => {
          return i !== num;
        });
      });
    } else {
      setSelect((prev) => {
        return [...prev, num];
      });
    }
  };

  function getObjectsAtIndices(objects, indices) {
    return indices.map((index) => objects[index]);
  }

  const handleExportToXlsx = () => {
    const data = getObjectsAtIndices(songs, select);

    exportToExcel(data, "Music_List");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.header}>
          <div className="flex gap-4 items-center">
            <h1 className="font-bold text-2xl">Quản lý bài hát</h1>
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
                placeholder="Tìm kiếm bài hát..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
          <Link href="/admin/music/add" passHref>
            <button className={styles.addButton}>
              <ReactSVG className={styles.csvg} src="/plus.svg" />
              <div className={styles.addText}>Thêm mới</div>
            </button>
          </Link>
        </div>
        <div className="flex gap-4 mt-4 justify-between">
          <div className="flex gap-4">
            <div className={styles.paginationControl}>
              <label htmlFor="songsPerPage">Số lượng: </label>
              <select
                id="songsPerPage"
                value={songsPerPage}
                onChange={(e) => setSongsPerPage(Number(e.target.value))}
                className={styles.paginationSelect}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
                <option value={35}>35</option>
                <option value={40}>40</option>
                <option value={45}>45</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className={styles.sortContainer}>
              <label htmlFor="sort">Sort: </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="latest">Ngày tạo (Mới nhất)</option>
                <option value="oldest">Ngày tạo (Cũ nhất)</option>
                <option value="nameAsc">Tên (A-Z)</option>
                <option value="nameDesc">Tên (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex gap-2">
            <button
              className={`flex gap-1 items-center py-1 px-3 border font-medium text-sm rounded-full transition duration-300 
              ${
                select?.length > 0
                  ? "border-blue-500 text-blue-500 hover:bg-blue-100"
                  : "border-gray-400 text-gray-400 cursor-not-allowed opacity-60"
              } 
              disabled:cursor-not-allowed disabled:opacity-60`}
              onClick={handleExportToXlsx}
              disabled={!(select?.length > 0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
              Export xlsx
            </button>
            {/* <button className="gap-1 flex item-center py-1 px-3 border font-medium text-sm rounded-full border-yellow-500 text-yellow-500 hover:bg-yellow-100 transition duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
              Import
            </button> */}
            <button
              onClick={() => fetch()}
              className="flex gap-1 items-center py-1 px-3 border font-medium text-sm rounded-full border-lime-500 text-lime-500 hover:bg-lime-100 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                  clipRule="evenodd"
                />
              </svg>
              Refresh
            </button>
          </div>
          <div className="flex items-center justify-end space-x-2">
            {/* Nút chuyển đến trang trước */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1} // Disable nút lùi khi đang ở trang đầu tiên
              className={`px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              &laquo;
            </button>

            {/* Hiển thị các trang */}
            {totalPages <= 7 ? (
              // Nếu tổng số trang <= 7, hiển thị tất cả các trang
              [...Array(totalPages)].map((_, index) => {
                const page = index + 1;
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
              })
            ) : (
              // Nếu tổng số trang > 7, hiển thị các trang xung quanh trang hiện tại
              <>
                {/* Dấu "..." nếu cần */}
                {currentPage > 3 && (
                  <span className="px-3 py-1 text-sm text-gray-500">...</span>
                )}

                {/* Các nút trang */}
                {[...Array(7)].map((_, index) => {
                  const page = currentPage - 3 + index; // Tính toán trang cần hiển thị
                  if (page < 1 || page > totalPages) return null; // Bỏ qua nếu số trang không hợp lệ
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
                })}

                {/* Dấu "..." nếu cần */}
                {currentPage < totalPages - 3 && totalPages > 7 && (
                  <span className="px-3 py-1 text-sm text-gray-500">...</span>
                )}
              </>
            )}

            {/* Nút chuyển đến trang sau */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages} // Disable nút tiến khi đang ở trang cuối cùng
              className={`px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              &raquo;
            </button>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={isArrayComplete(select, songs.length - 1)}
                />
              </th>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên bài hát</th>
              <th>Ca sĩ</th>
              <th>Ngày tạo</th>
              <th>Sáng tác</th>
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
              currentSongs.map((song) => (
                <tr key={song.id_music}>
                  <td>
                    <input
                      type="checkbox"
                      checked={select.includes(song.index)}
                      onChange={() => toggleSelect(song.index)}
                    />
                  </td>
                  <td>#{song.id_music}</td>
                  <td className="flex justify-center">
                    <Img
                      src={song.url_cover}
                      alt=""
                      unloader={<img src="/default.png" />}
                    />
                  </td>
                  <td>{song.name}</td>
                  <td>
                    {song.artists
                      .map((artistWrapper) => artistWrapper.artist.name)
                      .join(", ")}
                  </td>

                  <td className="text-center">
                    {new Date(song.created_at).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td>{song.composer}</td>
                  <td className="text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-regular ${
                        song.is_show === 0
                          ? "bg-red-200 text-red-600"
                          : "bg-green-200 text-green-600"
                      }`}
                    >
                      {song.is_show === 0 ? "Ẩn" : "Hiện"}
                    </span>
                  </td>

                  <td className={styles.actions}>
                    <button className={styles.editButton}>
                      <Link
                        href={`/admin/music/edit/${song.id_music}`}
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
    </div>
  );
}
