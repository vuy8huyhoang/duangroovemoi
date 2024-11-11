"use client";
import React, { useEffect, useState } from "react";
import styles from "./admin.module.scss";
import axios from "@/lib/axios";

export default function AdminDashboard() {
    const [album, setAlbum] = useState<number>(0);
    const [music, setMusic] = useState<number>(0);
    const [artist, setArtist] = useState<number>(0);
    const [user, setUser] = useState<number>(0);
    const [composer, setComposer] = useState<number>(0);
    const [notifications, setNotifications] = useState<string[]>([]); // Khai báo đúng kiểu là mảng chuỗi

    useEffect(() => {
        fetchAllData();

        const interval = setInterval(() => {
            checkForNewData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchAllData = () => {
        axios.get('/music')
            .then((response: any) => {
                if (response && response.result && response.result.data) {
                    setMusic(response.result.data.length);
                }
            })
            .catch((error: any) => console.error('Error fetching music:', error));

        axios.get('/artist')
            .then((response: any) => {
                if (response && response.result && response.result.data) {
                    setArtist(response.result.data.length);
                }
            })
            .catch((error: any) => console.error('Error fetching artists:', error));

        axios.get('/album')
            .then((response: any) => {
                if (response && response.result && response.result.data) {
                    setAlbum(response.result.data.length);
                }
            })
            .catch((error: any) => console.error('Error fetching albums:', error));

        axios.get('/user')
            .then((response: any) => {
                if (response && response.result && response.result.data) {
                    setUser(response.result.data.length);
                }
            })
            .catch((error: any) => console.error('Error fetching users:', error));

        axios.get('/composer')
            .then((response: any) => {
                if (response && response.result && response.result.data) {
                    setComposer(response.result.data.length);
                }
            })
            .catch((error: any) => console.error('Error fetching composers:', error));
    };


    const checkForNewData = () => {
        axios.get('/music')
            .then((response: any) => {
                if (response && response.data) {
                    const newMusicCount = response.data.length;
                    if (newMusicCount > music) {
                        setNotifications(prev => [...prev, `Có ${newMusicCount - music} bài hát mới được thêm`]);
                    }
                    setMusic(newMusicCount);
                }
            })
            .catch((error: any) => console.error('Error fetching music:', error));

        axios.get('/user')
            .then((response: any) => {
                if (response && response.data) {
                    const newUserCount = response.data.length;
                    if (newUserCount > user) {
                        setNotifications(prev => [...prev, `${newUserCount - user} người dùng mới đăng ký`]);
                    }
                    setUser(newUserCount);
                }
            })
            .catch((error: any) => console.error('Error fetching users:', error));

        axios.get('/album')
            .then((response: any) => {
                if (response && response.data) {
                    const newAlbumCount = response.data.length;
                    if (newAlbumCount > album) {
                        setNotifications(prev => [...prev, `Có ${newAlbumCount - album} album mới được thêm`]);
                    }
                    setAlbum(newAlbumCount);
                }
            })
            .catch((error: any) => console.error('Error fetching albums:', error));

        axios.get('/artist')
            .then((response: any) => {
                if (response && response.data) {
                    const newArtistCount = response.data.length;
                    if (newArtistCount > artist) {
                        setNotifications(prev => [...prev, `Có ${newArtistCount - artist} nghệ sĩ mới`]);
                    }
                    setArtist(newArtistCount);
                }
            })
            .catch((error: any) => console.error('Error fetching artists:', error));

        axios.get('/composer')
            .then((response: any) => {
                if (response && response.data) {
                    const newComposerCount = response.data.length;
                    if (newComposerCount > composer) {
                        setNotifications(prev => [...prev, `Có ${newComposerCount - composer} nhạc sĩ mới`]);
                    }
                    setComposer(newComposerCount);
                }
            })
            .catch((error: any) => console.error('Error fetching composers:', error));
    };

    return (
        <div className={styles.dashboardContainer}>
            <h2 className={styles.dashboardTitle}>Bảng điều khiển</h2>

            <div className={styles.statsContainer}>
                <div className={styles.statCard}>
                    <div className={`${styles.icon} ${styles.music}`}>
                        <i className="fas fa-music"></i>
                    </div>
                    <div className={styles.title}>
                        <h3>TỔNG BÀI HÁT</h3>
                        <p>{music ? `${music} bài hát` : 'Đang tải...'}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.icon} ${styles.artist}`}>
                        <i className="fas fa-user"></i>
                    </div>
                    <div className={styles.title}>
                        <h3>TỔNG NGHỆ SĨ</h3>
                        <p>{artist ? `${artist} nghệ sĩ` : 'Đang tải...'}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.icon} ${styles.album}`}>
                        <i className="fas fa-record-vinyl"></i>
                    </div>
                    <div className={styles.title}>
                        <h3>TỔNG ALBUM</h3>
                        <p>{album ? `${album} album` : 'Đang tải...'}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.icon} ${styles.user}`}>
                        <i className="fas fa-users"></i>
                    </div>
                    <div className={styles.title}>
                        <h3>TỔNG NGƯỜI DÙNG</h3>
                        <p>{user ? `${user} người dùng` : 'Đang tải...'}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.icon} ${styles.composer}`}>
                        <i className="fas fa-guitar"></i>
                    </div>
                    <div className={styles.title}>
                        <h3>TỔNG NHẠC SĨ</h3>
                        <p>{composer ? `${composer} nhạc sĩ` : 'Đang tải...'}</p>
                    </div>
                </div>
            </div>
            <div className={styles.notificationSidebar}>
                <h3 className={styles.sidebarTitle}>Thông báo</h3>
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>{notification}</li>
                    ))}
                </ul>
            </div>

        </div>
    );
}
