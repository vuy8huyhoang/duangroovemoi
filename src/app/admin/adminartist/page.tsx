"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "./AdminArtist.module.scss";
import { ReactSVG } from "react-svg";
import Link from 'next/link';

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
    const [musicByArtist, setMusicByArtist] = useState<{ [key: string]: Music[] }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMusic, setLoadingMusic] = useState<{ [key: string]: boolean }>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [artistsPerPage, setArtistsPerPage] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("nameAsc");

    useEffect(() => {
        axios
            .get("/artist")
            .then((response: any) => {
                console.log("Full API response:", response);
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
                    const response: any = await axios.get(`/music?id_artist=${artist.id_artist}`);
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
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } else if (sortOption === "dateDesc") {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
    });

    const indexOfLastArtist = currentPage * artistsPerPage;
    const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
    const currentArtists = sortedArtists.slice(indexOfFirstArtist, indexOfLastArtist);
    const totalPages = Math.ceil(sortedArtists.length / artistsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, artistsPerPage]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Quản lý ca sĩ</h1>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm ca sĩ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.paginationControl}>
                    <label htmlFor="artistsPerPage">Số ca sĩ mỗi trang:</label>
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
                
                <Link href="/admin/addartist" passHref>
                    <button className={styles.addButton}>
                        <ReactSVG className={styles.csvg} src="/plus.svg" />
                        <div className={styles.addText}>Tạo ca sĩ mới</div>
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
                            <th>Hình ảnh</th>
                            <th>Tên ca sĩ</th>
                            <th>Bài hát</th>
                            <th>Ngày tạo</th>
                            <th>Ẩn hiện</th>
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
                                    <td><img src={artist.url_cover} alt={artist.name} /></td>
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
                                    <td>{new Date(artist.created_at).toLocaleString('vi-VN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour12: false
                                    })}</td>
                                    <td>{artist.is_show===1?"Hiện":"Ẩn"}</td>
                                    <td className={styles.actions}>
                                        <button className={styles.editButton}>
                                            <Link href={`/admin/editartist/${artist.id_artist}`} passHref>
                                                <ReactSVG className={styles.csvg} src="/Rectangle 80.svg" />
                                            </Link>
                                        </button>
                                        <button className={styles.deleteButton} onClick={() => handleDeleteArtist(artist.id_artist, artist.url_cover)}>
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
