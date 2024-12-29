"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import styles from "../tables.module.scss";

interface Composer {
  id_composer: string;
  name: string;
  created_at: string;
  last_update: string;
}

export default function AdminComposer() {
  const [loading, setLoading] = useState<boolean>(true);
  const [composers, setComposers] = useState<Composer[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [composersPerPage, setComposersPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("nameAsc");

  useEffect(() => {
    axios
      .get("/composer")
      .then((response: any) => {
        // console.log("Full API response:", response);
        if (response && response.result && response.result.data) {
          setComposers(response.result.data);
        } else {
          console.error("Response data is undefined or empty:", response);
          setComposers([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch ca sĩ:", error);
        setComposers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDeleteArtist = async (id_composer: string) => {
    try {
      await axios.delete(`/composer/${id_composer}`);
      setComposers(
        composers.filter((composer) => composer.id_composer !== id_composer)
      );
    } catch (error) {
      console.error("Lỗi xóa ca sĩ:", error);
    }
  };

  const filteredComposers = composers.filter((composer) =>
    composer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedComposers = filteredComposers.sort((a, b) => {
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

  const indexOfLastComposer = currentPage * composersPerPage;
  const indexOfFirstComposer = indexOfLastComposer - composersPerPage;
  const currentComposers = sortedComposers.slice(
    indexOfFirstComposer,
    indexOfLastComposer
  );
  const totalPages = Math.ceil(sortedComposers.length / composersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, composersPerPage]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý nhạc sĩ</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm nhạc sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.paginationControl}>
          <label htmlFor="composersPerPage">Số nhạc sĩ mỗi trang:</label>
          <select
            id="composersPerPage"
            value={composersPerPage}
            onChange={(e) => setComposersPerPage(Number(e.target.value))}
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

        <Link href="/admin/addcomposer" passHref>
          <button className={styles.addButton}>
            <ReactSVG className={styles.csvg} src="/plus.svg" />
            <div className={styles.addText}>Tạo nhạc sĩ mới</div>
          </button>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.artistTable}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>ID</th>
              {/* <th>Hình ảnh</th> */}
              <th>Tên nhạc sĩ</th>
              <th>Ngày tạo</th>
              <th>Tính năng</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className={styles.loading}>
                  Đang tải...
                </td>
              </tr>
            ) : (
              currentComposers.map((composer) => (
                <tr key={composer.id_composer}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>#{composer.id_composer}</td>
                  {/* <td><img src={composer.url_cover} alt={composer.name} /></td> */}
                  <td>{composer.name}</td>
                  <td>
                    {new Date(composer.created_at).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.editButton}>
                      <Link
                        href={`/admin/editcomposer/${composer.id_composer}`}
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
                      onClick={() => handleDeleteArtist(composer.id_composer)}
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

      {/* Phân trang */}
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
