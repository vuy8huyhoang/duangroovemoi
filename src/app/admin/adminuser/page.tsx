"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "./AdminUser.module.scss";
import { ReactSVG } from "react-svg";
import Link from 'next/link';

interface User {
    id_user: string;
    fullname: string;
    email: string;
    role: 'user' | 'admin';
    url_avatar?: string;
    is_banned: number;
}

export default function AdminUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
    const usersPerPage = 10;

    useEffect(() => {
        

        axios
            .get("/user")
            .then((response: any) => {
                if (response && response.result && response.result.data) {
                    setUsers(response.result.data);
                console.log("toàn bộ user", response);
                
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

   
   

    // Ví dụ về hàm cập nhật trạng thái người dùng qua API
    


    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Quản lý user</h1>
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
                                    <td><img src={user.url_avatar || "/Group 66.svg"} alt="Avatar" /></td>
                                    <td>{user.fullname}</td>
                                    <td>{user.email}</td>
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
                                        {user.is_banned==1?"Bị khoá":"Hoạt động"}
                                    </td>
                                    
                                        <td className={styles.actions}>
                                            <button className={styles.editButton}>
                                                <Link href={`/admin/edituser/${user.id_user}`} passHref>
                                                    <ReactSVG className={styles.csvg} src="/Rectangle 80.svg" />
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
                        className={currentPage === index + 1 ? styles.activePage : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>

    );
}
