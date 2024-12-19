"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "@/lib/axios";
import styles from "./AdminType.module.scss";
import { ReactSVG } from "react-svg";

interface Type {
    id_type: string;
    name: string;
    slug: string;
    created_at: string;
    is_show: boolean;
}

const TypeManagement = () => {
    const [categories, setCategories] = useState<Type[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [typesPerPage, setTypesPerPage] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("nameAsc");

    useEffect(() => {
        fetchType();
    }, []);

    const fetchType = async () => {
        try {
            const response: any = await axios.get("/type");
            setCategories(response.result.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteType = async (id: string) => {
        try {
            await axios.delete(`/type/${id}`);
            setCategories(categories.filter((category) => category.id_type !== id));
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    const filteredTypes = categories.filter(
        (type) =>
            type.name.toLowerCase().includes(searchTerm.toLowerCase()) 
           
    );

    const sortedTypes = filteredTypes.sort((a, b) => {
        if (sortOption === "nameAsc") {
            return a.name.localeCompare(b.name);
        } else if (sortOption === "nameDesc") {
            return b.name.localeCompare(a.name);
        } else if (sortOption === "dateAsc") {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } else if (sortOption === "dateDesc") {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
    });

    const indexOfLastType = currentPage * typesPerPage;
    const indexOfFirstType = indexOfLastType - typesPerPage;
    const currentTypes = sortedTypes.slice(indexOfFirstType, indexOfLastType);
    const totalPages = Math.ceil(sortedTypes.length / typesPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, typesPerPage]);


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Quản lý thể loại</h1>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm thể loại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.paginationControl}>
                    <label htmlFor="typesPerPage">Số thể loại trên một trang:</label>
                    <select
                        id="typesPerPage"
                        value={typesPerPage}
                        onChange={(e) => setTypesPerPage(Number(e.target.value))}
                        className={styles.paginationSelect}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
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
                <Link href="/admin/addtype" passHref>
                    <button className={styles.addButton}>
                        <ReactSVG className={styles.csvg} src="/plus.svg" />
                        <div className={styles.addText}>Tạo thể loại mới</div>
                    </button>
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.typeTable}>
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" />
                            </th>
                            <th>ID</th>
                            <th>Tên thể loại</th>
                            <th>Slug</th>
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
                            currentTypes.map((type) => (
                                <tr key={type.id_type}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>#{type.id_type}</td>
                                    <td>{type.name}</td>
                                    <td>{type.slug}</td>
                                    <td>{new Date(type.created_at).toLocaleString('vi-VN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}</td>
                                    <td>{type.is_show ? 'Hiển thị' : 'Ẩn'}</td>
                                    <td className={styles.actions}>
                                        <button className={styles.editButton}>
                                            <Link href={`/admin/edittype/${type.id_type}`} passHref>
                                                <ReactSVG className={styles.csvg} src="/Rectangle 80.svg" />
                                            </Link>
                                        </button>
                                        <button className={styles.deleteButton} onClick={() => handleDeleteType(type.id_type)}>
                                            <ReactSVG className={styles.csvg} src="/Rectangle 79.svg" />
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
};

export default TypeManagement;
