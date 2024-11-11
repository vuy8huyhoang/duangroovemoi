import React, { useState, useEffect } from 'react';
import styles from './AdminSidebar.module.scss';
import Link from 'next/link';
import { ReactSVG } from 'react-svg';
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';
import axios from '@/lib/axios';

interface Profile {
    birthday: string;
    country: string;
    created_at: string;
    email: string;
    fullname: string;
    gender: string;
    last_update: string;
    phone: string;
    role: string;
    url_avatar: string;
}
const AdminSidebar: React.FC = () => {
    const [activeItem, setActiveItem] = useState<string>('Bảng điều khiển'); 
    const pathname = usePathname();
    const [profileData, setProfileData] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);    console.log(profileData)
    const handleMenuClick = (item: string) => {
        setActiveItem(item);
        if (typeof window !== 'undefined') {
            localStorage.setItem('activeAdminItem', item); 
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedItem = localStorage.getItem('activeAdminItem');
            if (storedItem) {
                setActiveItem(storedItem);
            }
        }
    }, []); 
    useEffect(() => {
        axios.get("profile")
            .then((response: any) => {
                console.log(response);

                if (response && response.result.data) {
                    setProfileData(response.result.data);
                    console.log(setProfileData);
                } else {
                    console.error('Response data is undefined or null', response);
                }
            })
            .catch((error: any) => {
                console.error('Error fetching profile details', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    return (
        <div className={styles.sidebar}>
            <div className={styles.user}>
                <img
                    className={styles.avatar}
                    src={profileData?.url_avatar ? profileData.url_avatar : "/Group 66.svg"}
                    alt="User Avatar"
                />

                <div className={styles.userInfo}>
                    <p className={styles.userName}><b>{profileData?.fullname? profileData.fullname:""}</b></p>
                    <p className={styles.userWelcome}>Chào mừng bạn trở lại</p>
                </div>
            </div>

            <ul className={styles.menu}>
                <li>
                    <Link
                        href="/admin"
                        className={clsx(styles.menuItem, { [styles.active]: pathname === "/admin" })}
                    >
                        <ReactSVG className={styles.csvg} src="/Control Panel.svg" />
                        <div className={styles.menuText}>Bảng điều khiển</div>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/adminmusic"
                        className={clsx(styles.menuItem, { [styles.active]: pathname === "/admin/adminmusic" })}
                    >
                        <ReactSVG className={styles.csvg} src="/Music video.svg" />
                        <div className={styles.menuText}>Quản lý bài hát</div>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/admintype"
                        className={clsx(styles.menuItem, { [styles.active]: pathname === "/admin/admintype" })}
                    >
                        <ReactSVG className={styles.csvg} src="/Category.svg" />
                        <div className={styles.menuText}>Quản lý thể loại</div>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/adminalbum"
                        className={clsx(styles.menuItem, { [styles.active]: pathname === "/admin/adminalbum" })}
                    >
                        <ReactSVG className={styles.csvg} src="/Album.svg" />
                        <div className={styles.menuText}>Quản lý album</div>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/adminartist"
                        className={clsx(styles.menuItem, { [styles.active]: pathname === "/admin/adminartist" })}
                    >
                        <ReactSVG className={styles.csvg} src="/iconamoon_music-artist.svg" />
                        <div className={styles.menuText}>Quản lý ca sĩ</div>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/admincomposer"
                        className={clsx(styles.menuItem, { [styles.active]: pathname === "/admin/admincomposer" })}
                    >
                        <ReactSVG className={styles.csvg} src="/iconamoon_music-artist.svg" />
                        <div className={styles.menuText}>Quản lý nhạc sĩ</div>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/adminuser"
                        className={clsx(styles.menuItem, { [styles.active]: pathname === "/admin/adminuser" })}
                    >
                        <ReactSVG className={styles.csvg} src="/Male User.svg" />
                        <div className={styles.menuText}>Quản lý người dùng</div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
