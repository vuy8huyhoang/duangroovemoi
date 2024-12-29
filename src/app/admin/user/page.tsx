"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "../tables.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";

interface User {
  id_user: string;
  fullname: string;
  email: string;
  role: "user" | "admin";
  url_avatar?: string;
  is_banned: number; //
  created_at: string;
}

export default function AdminUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("latest");
  const [usersPerPage, setUsersPerPage] = useState<number>(10);

  useEffect(() => {
    axios
      .get("/user")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          setUsers(response.result.data);
          // console.log("toàn bộ user", response);
        } else {
          console.error("Response data is undefined or empty:", response);
          setUsers([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch user:", error);
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortOption === "latest") {
      return b.created_at.localeCompare(a.created_at);
    } else if (sortOption === "oldest") {
      return a.created_at.localeCompare(b.created_at);
    } else if (sortOption === "nameAsc") {
      return a.fullname.localeCompare(b.fullname);
    } else if (sortOption === "nameDesc") {
      return b.fullname.localeCompare(a.fullname);
    }
    return 0;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, usersPerPage]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý user</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.paginationControl}>
          <label htmlFor="usersPerPage">Số user trên một trang:</label>
          <select
            id="usersPerPage"
            value={usersPerPage}
            onChange={(e) => setUsersPerPage(Number(e.target.value))}
            className={styles.paginationSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
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
            <option value="latest">Ngày tạo (Mới nhất)</option>
            <option value="oldest">Ngày tạo (Cũ nhất)</option>
            <option value="nameAsc">Tên (A-Z)</option>
            <option value="nameDesc">Tên (Z-A)</option>
          </select>
        </div>
        <Link href="/admin/adduser" passHref>
          <button className={styles.addButton}>
            <ReactSVG className={styles.csvg} src="/plus.svg" />
            <div className={styles.addText}>Tạo user mới</div>
          </button>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>ID</th>
              <th>Avatar</th>
              <th>Tên đầy đủ</th>
              <th>Email</th>
              <th>Ngày tạo</th>
              <th>Vai trò</th>
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
              currentUsers.map((user) => (
                <tr key={user.id_user}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{user.id_user}</td>
                  <td>
                    <img
                      src={user.url_avatar || "/Group 66.svg"}
                      alt="Avatar"
                    />
                  </td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>
                    {new Date(user.created_at).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td>{user.role}</td>
                  <td>
                    {/* Select dropdown để thay đổi trạng thái */}
                    {/* <select
                                            value={user.is_banned ? '1' : '0'}
                                            onChange={(e) => handleStatusChange(e, user.id_user)}
                                        >
                                            <option value="0">Hoạt động</option>
                                            <option value="1">Bị khóa</option>
                                        </select> */}
                    {user.is_banned == 1 ? "Bị khoá" : "Hoạt động"}
                  </td>

                  <td className={styles.actions}>
                    <button className={styles.editButton}>
                      <Link href={`/admin/edituser/${user.id_user}`} passHref>
                        <ReactSVG
                          className={styles.csvg}
                          src="/Rectangle 80.svg"
                        />
                      </Link>
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
