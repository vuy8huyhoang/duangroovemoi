"use client"
import { useState, useEffect } from 'react';
import styles from './sidebar.module.scss';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
export default function Sidebar() {
    const [activeItem, setActiveItem] = useState<string>('Khám Phá');
    const pathname = usePathname();
    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <a href="/">
                    <img src="/logo.svg" alt="Groove Logo" />
                </a>
            </div>
            <ul className={styles.menu}>
                <li


                >
                    <Link href="/thuvien" className={clsx(styles.menuItem, { [styles.active]: pathname === "/thuvien" })}>

                        <ReactSVG className={styles.csvg} src="/Group (1).svg" />
                        <span>Thư Viện</span>
                    </Link>
                </li>
                <li
                >
                    <Link href="/" className={clsx(styles.menuItem, { [styles.active]: pathname === "/" })}>

                        <ReactSVG className={styles.csvg} src="/earth_light.svg" />
                        <span>Khám Phá</span>
                    </Link>
                </li>
                <li

                >

                    <Link href="/groovechart" className={clsx(styles.menuItem, { [styles.active]: pathname === "/groovechart" })}>

                        <ReactSVG className={styles.csvg} src="/Vector (1).svg" />
                        <span>#groovechart</span>
                    </Link>
                </li>
                
                <li

                >
                    <Link href="/type" className={clsx(styles.menuItem, { [styles.active]: pathname === "/type" })}>

                        <ReactSVG className={styles.csvg} src="/type_light.svg" />
                        <span>Chủ Đề & Thể Loại</span>
                    </Link>
                </li>
            </ul>
            <ul className={styles.submenu}>
                <li

                >
                    <Link href="/historymusic" className={clsx(styles.menuItem, { [styles.active]: pathname === "/historymusic" })}>

                        <ReactSVG className={styles.csvg} src="/Frame 10.svg" />
                        <span>Nghe gần đây</span>
                    </Link>
                </li>
                <li

                >
                    <Link href="/favorites" className={clsx(styles.menuItem, { [styles.active]: pathname === "/favorites" })}>

                        <ReactSVG className={styles.csvg} src="/Frame 10 (1).svg" />
                        <span>Bài hát yêu thích</span>
                    </Link>
                </li>
                <li

                >
                    <Link href="/playlist" className={clsx(styles.menuItem, { [styles.active]: pathname === "/playlist" })}>

                        <ReactSVG className={styles.csvg} src="/Frame 10 (2).svg" />
                        <span>Playlist</span>
                    </Link>
                </li>
                <li

                >
                    <Link href="/album" className={clsx(styles.menuItem, { [styles.active]: pathname === "/album" })}>

                        <ReactSVG className={styles.csvg} src="/Frame 10 (3).svg" />
                        <span>Album</span>
                    </Link>
                </li>
            </ul>
            <div className={styles.createPlaylist}>
                <button>
                    <ReactSVG src="/vector (3).svg" />
                    Tạo playlist mới
                </button>
            </div>
        </div>
    );
}
