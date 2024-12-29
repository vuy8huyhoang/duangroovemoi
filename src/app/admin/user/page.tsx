"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "../tables.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import { Img } from "react-image";

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
      <div className={styles.tableContainer}>
        <div className={styles.header}>
          <div className="flex gap-4 items-center">
            <h1 className="font-bold text-2xl">Quản lý user</h1>
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

          <Link href="/admin/user/add" passHref>
            <button className={styles.addButton}>
              <ReactSVG className={styles.csvg} src="/plus.svg" />
              <div className={styles.addText}>Thêm mới</div>
            </button>
          </Link>
        </div>
        <div className="flex gap-4 mt-4 justify-between">
          <div className="flex gap-4">
            <div className={styles.paginationControl}>
              <label htmlFor="usersPerPage">Số lượng:</label>
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
            <div>
              <label htmlFor="sort">Sort: </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={styles.sortSelect}
                id="sort"
              >
                <option value="latest">Ngày tạo (Mới nhất)</option>
                <option value="oldest">Ngày tạo (Cũ nhất)</option>
                <option value="nameAsc">Tên (A-Z)</option>
                <option value="nameDesc">Tên (Z-A)</option>
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
                  <td className="max-w-24 overflow-auto text-nowrap">
                    {user.id_user}
                  </td>
                  <td className="text-center flex justify-center items-center h-full">
                    <Img
                      src={user.url_avatar}
                      alt="Avatar"
                      unloader={<>-</>}
                    ></Img>
                  </td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td className="text-center">
                    {new Date(user.created_at).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td className="text-center">
                    {user?.role && (
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-800 ${
                          user.role === "user"
                            ? "bg-amber-200"
                            : user.role === "admin"
                            ? "bg-indigo-200"
                            : "bg-gray-200"
                        }`}
                      >
                        {user.role === "user"
                          ? "User"
                          : user.role === "admin"
                          ? "Admin"
                          : user.role}
                      </div>
                    )}
                  </td>

                  <td className="text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        user.is_banned === 1
                          ? "bg-red-200 text-red-600"
                          : "bg-green-200 text-green-600"
                      }`}
                    >
                      {user.is_banned === 1 ? "Banned" : "Active"}
                    </span>
                  </td>

                  <td className={styles.actions}>
                    <button className={styles.editButton}>
                      <Link href={`/admin/user/edit/${user.id_user}`} passHref>
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
    </div>
  );
}
