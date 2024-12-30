"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "../tables.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import { Img } from "react-image";

interface Artist {
  id_artist: string;
  name: string;
  slug: string | null;
  url_cover: string;
  created_at: string;
  last_update: string;
  is_show: number;
  followers: number;
}

interface Music {
  id_music: string;
  name: string;
}

export default function AdminArtist() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [musicByArtist, setMusicByArtist] = useState<{
    [key: string]: Music[];
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMusic, setLoadingMusic] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [artistsPerPage, setArtistsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("nameAsc");

  useEffect(() => {
    axios
      .get("/artist")
      .then((response: any) => {
        // console.log("Full API response:", response);
        if (response && response.result && response.result.data) {
          setArtists(response.result.data);
          fetchMusicByArtists(response.result.data);
        } else {
          console.error("Response data is undefined or empty:", response);
          setArtists([]);
        }
      })
      .catch((error: any) => {
        console.error("Error fetching artists:", error);
        setArtists([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchMusicByArtists = async (artists: Artist[]) => {
    const loadingStatus: { [key: string]: boolean } = {};
    artists.forEach((artist) => {
      loadingStatus[artist.id_artist] = true;
    });
    setLoadingMusic(loadingStatus);

    try {
      const musicData = await Promise.all(
        artists.map(async (artist) => {
          const response: any = await axios.get(
            `/music?id_artist=${artist.id_artist}`
          );
          return {
            id_artist: artist.id_artist,
            music: response?.result?.data || [],
          };
        })
      );

      const newMusicByArtist: { [key: string]: Music[] } = {};
      const newLoadingStatus: { [key: string]: boolean } = {};
      musicData.forEach(({ id_artist, music }) => {
        newMusicByArtist[id_artist] = music;
        newLoadingStatus[id_artist] = false;
      });

      setMusicByArtist(newMusicByArtist);
      setLoadingMusic(newLoadingStatus);
    } catch (error) {
      console.error("Error fetching music by artist:", error);
    }
  };

  const handleDeleteArtist = async (id_artist: string, url: string) => {
    try {
      await axios.delete(`/artist/${id_artist}`);
      setArtists(artists.filter((artist) => artist.id_artist !== id_artist));
      await axios.delete(`/upload-image?url=${url}`);
    } catch (error) {
      console.error("Error deleting artist:", error);
    }
  };

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedArtists = filteredArtists.sort((a, b) => {
    if (sortOption === "nameAsc") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "nameDesc") {
      return b.name.localeCompare(a.name);
    } else if (sortOption === "dateAsc") {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortOption === "dateDesc") {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return 0;
  });

  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = sortedArtists.slice(
    indexOfFirstArtist,
    indexOfLastArtist
  );
  const totalPages = Math.ceil(sortedArtists.length / artistsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, artistsPerPage]);

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.header}>
          <div className="flex gap-4 items-center">
            <h1 className="font-bold text-2xl">Quản lý ca sĩ</h1>
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

          <Link href="/admin/addartist" passHref>
            <button className={styles.addButton}>
              <ReactSVG className={styles.csvg} src="/plus.svg" />
              <div className={styles.addText}>Tạo ca sĩ mới</div>
            </button>
          </Link>
        </div>
        <div className="flex gap-4 mt-4 justify-between">
          <div className="flex gap-4">
            <div className={styles.paginationControl}>
              <label htmlFor="artistsPerPage">Số lượng:</label>
              <select
                id="artistsPerPage"
                value={artistsPerPage}
                onChange={(e) => setArtistsPerPage(Number(e.target.value))}
                className={styles.paginationSelect}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className={styles.sortContainer}>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="nameAsc">Tên (A-Z)</option>
                <option value="nameDesc">Tên (Z-A)</option>
                <option value="dateAsc">Ngày tạo (Cũ nhất)</option>
                <option value="dateDesc">Ngày tạo (Mới nhất)</option>
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
              <th>Tên ca sĩ</th>
              <th>Bài hát</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Tính năng</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className={styles.loading}>
                  Đang tải...
                </td>
              </tr>
            ) : (
              currentArtists.map((artist) => (
                <tr key={artist.id_artist}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>#{artist.id_artist}</td>
                  <td className="flex justify-center">
                    <Img
                      src={artist.url_cover}
                      alt={artist.name}
                      unloader={<img src="/default.png" />}
                    />
                  </td>
                  <td>{artist.name}</td>
                  <td>
                    {loadingMusic[artist.id_artist] ? (
                      "Đang tải bài hát..."
                    ) : musicByArtist[artist.id_artist]?.length > 0 ? (
                      <ul>
                        {musicByArtist[artist.id_artist].map((music) => (
                          <li key={music.id_music}>{music.name}</li>
                        ))}
                      </ul>
                    ) : (
                      "Hiện chưa có bài hát nào"
                    )}
                  </td>
                  <td className="text-center">
                    {new Date(artist.created_at).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td className="text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-regular ${
                        artist.is_show === 0
                          ? "bg-red-200 text-red-600"
                          : "bg-green-200 text-green-600"
                      }`}
                    >
                      {artist.is_show === 0 ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.editButton}>
                      <Link
                        href={`/admin/editartist/${artist.id_artist}`}
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
                        handleDeleteArtist(artist.id_artist, artist.url_cover)
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
