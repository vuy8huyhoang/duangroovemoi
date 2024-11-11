'use client';
import React, { useState, useEffect } from 'react';
import styles from './Header.module.scss';
import Login from '../auth';
import Link from 'next/link';
import Search from '../search';
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
const Header: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const toggleLoginPopup = () => {
    if (!isLoggedIn) {
      setShowLogin((prev) => !prev);
    }
  };

  const toggleDropdown = () => {
    if (isLoggedIn) {
      setShowDropdown((prev) => !prev);
    }
  };
  const closeDropdown=()=>{
    setShowDropdown(false);
  }
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profileData");
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
      setShowLogin(false);
    } else {
      setIsLoggedIn(false);
    }
  }, [showLogin]);
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
    <header className={styles.zingHeader}>
      <div className={styles.headerLeft}>
        <i className="fa fa-arrow-left"></i>
        <i className="fa fa-arrow-right"></i>
      </div>
      <div className={styles.headerCenter}>
        <Search /> 
      </div>
      <div className={styles.headerRight}>
        <img src="/Vector.svg" alt="" />
        <img src="/Group 24.svg" alt="" />

        <div className={styles.settingsContainer}>
          {isLoggedIn ? (
            <>
              <img
                src={profileData?.url_avatar ? profileData.url_avatar : "/Setting.svg"}
                className={styles.avt}
                alt="Settings"
                onClick={toggleDropdown}
                style={{ cursor: 'pointer' }}
              />
              {showDropdown && (
                <div className={styles.dropdownMenu}>
                  <ul>
                  <li onClick={closeDropdown}><Link href="/profile">Tài Khoản</Link></li>
                  <li onClick={closeDropdown}><Link href="/change-password">Đổi mật khẩu</Link></li>
                    <li onClick={handleLogout}>Đăng xuất</li>
                    
                  </ul>
                </div>
              )}
            </>
          ) : (
            <img
              src="/Setting.svg"
              alt="Settings"
              onClick={toggleLoginPopup}
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>
      </div>

      {showLogin && !isLoggedIn && <Login closePopup={toggleLoginPopup} />}
    </header>
  );
};

export default Header;
