"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { ReactSVG } from "react-svg";
import Link from 'next/link';
import styles from "./AdminComposer.module.scss";

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
    const [itemsPerPage] = useState<number>(10);

    useEffect(() => {
        axios
            .get("/composer")
            .then((response: any) => {
                console.log("Full API response:", response);
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
            setComposers(composers.filter((composer) => composer.id_composer !== id_composer));
        } catch (error) {
            console.error("Lỗi xóa ca sĩ:", error);
        }
    };

    // Tính toán phân trang
    const indexOfLastComposer = currentPage * itemsPerPage;
    const indexOfFirstComposer = indexOfLastComposer - itemsPerPage;
    const currentComposers = composers.slice(indexOfFirstComposer, indexOfLastComposer);

    // Tạo các số trang
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(composers.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Quản lý nghệ sĩ</h1>
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
                                    <td>{new Date(composer.created_at).toLocaleString('vi-VN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour12: false
                                    })}</td>
                                    <td className={styles.actions}>
                                        <button className={styles.editButton}>
                                            <Link href={`/admin/editcomposer/${composer.id_composer}`} passHref>
                                                <ReactSVG className={styles.csvg} src="/Rectangle 80.svg" />
                                            </Link>
                                        </button>
                                        <button className={styles.deleteButton} onClick={() => handleDeleteArtist(composer.id_composer)}>
                                            <ReactSVG className={styles.csvg} src="/Rectangle 79.svg" />
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
                {pageNumbers.map(number => (
                    <button key={number} onClick={() => setCurrentPage(number)} className={currentPage === number ? styles.active : ''}>
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}
