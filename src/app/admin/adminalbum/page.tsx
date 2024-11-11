"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "./adminAlbum.module.scss";
import { ReactSVG } from "react-svg";
import Link from 'next/link';

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
    const albumsPerPage = 10;

    useEffect(() => {
        axios.get("/album").then((response: any) => {
            console.log("Full API response:", response);
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


    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum);
    const totalPages = Math.ceil(albums.length / albumsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Quản lý Album</h1>
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
                            <th>Tính năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className={styles.loading}>
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
                                    <td><img src={album.url_cover} alt={album.name} /></td>
                                    <td>{album.name}</td>
                                    <td>{album.artist.name}</td>
                                    <td>{new Date(album.release_date).toLocaleString('vi-VN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}</td>
                                    <td>
                                        <ul className={styles.songList}>
                                            {album.musics.map((music) => (
                                                <li key={music.id_music}>
                                                    <a href={music.url_path} target="_blank" rel="noopener noreferrer">
                                                        {music.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className={styles.actions}>
                                        <button className={styles.editButton}>
                                            <Link href={`/admin/editalbum/${album.id_album}`} passHref>
                                                <ReactSVG className={styles.csvg} src="/Rectangle 80.svg" />
                                            </Link>
                                        </button>
                                        <button className={styles.deleteButton} onClick={() => handleDeleteAlbum(album.id_album)}>
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
}
