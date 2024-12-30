"use client";
import React, { useState, useEffect, useContext } from "react";
import styles from "./Header.module.scss";
import Link from "next/link";
import Search from "./search";
import axios from "@/lib/axios";
import { AppContext } from "@/app/layout";
import clsx from "clsx";
import { ReactSVG } from "react-svg";
import { formatTimeFromNow } from "@/utils/String";
import { useRouter } from "next/navigation";

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
  is_vip: number;
}
const Header = () => {
  const { state, dispatch } = useContext(AppContext);
  const [showLogin, setShowLogin] = useState(state?.showLogin);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isOpenNotify, setIsOpenNotify] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifyData, setNotifyData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (state?.showLogin !== showLogin) {
      dispatch({ type: "SHOW_LOGIN", payload: showLogin });
    }
  }, [showLogin]);

  useEffect(() => {
    if (state?.showLogin !== showLogin) {
      setShowLogin(state?.showLogin);
    }
  }, [state?.showLogin]);

  const toggleLoginPopup = () => {
    if (!isLoggedIn) {
      // setShowLogin((prev) => !prev);
      dispatch({ type: "SHOW_LOGIN", payload: !state?.showLogin });
    }
  };
  const toggleDropdown = () => {
    if (isLoggedIn) {
      setShowDropdown((prev) => !prev);
    }
  };
  const closeDropdown = () => {
    setShowDropdown(false);
  };
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("profileData");
    }
    setIsLoggedIn(false);
    setShowDropdown(false);
    setProfileData(null);
    dispatch({ type: "PROFILE", payload: null });
    setIsOpenNotify(false);
    router.push("/");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        setIsLoggedIn(true);
        setShowLogin(false);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, [showLogin]);

  useEffect(() => {
    axios
      .get("profile")
      .then((response: any) => {
        // console.log(response);

        if (response && response.result.data) {
          setProfileData(response.result.data);
          dispatch({ type: "PROFILE", payload: response.result.data });
        } else {
          console.error("Response data is undefined or null", response);
        }
      })
      .catch((error: any) => {
        console.error("Error fetching profile details", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (state?.profile) {
      console.log("FMH: ", localStorage?.getItem("accessToken"));
      if (state?.profile?.is_vip === 1) {
        axios.get("playlist/me").then((res: any) => {
          dispatch({ type: "PLAYLIST", payload: res.result.data });
        });
      }
      axios.get("favorite-music/me").then((res: any) => {
        dispatch({ type: "FAVORITE_MUSIC", payload: res.result.data });
      });
      axios.get("favorite-album/me").then((res: any) => {
        dispatch({ type: "FAVORITE_ALBUM", payload: res.result.data });
      });
      axios.get("notification").then((res: any) => {
        setNotifyData(res.result.data);
        console.log(res.result.data);
      });
    }
    if (!state?.profile) {
      dispatch({ type: "PLAYLIST", payload: [] });
      dispatch({ type: "FAVORITE_MUSIC", payload: [] });
      dispatch({ type: "FAVORITE_ALBUM", payload: [] });
      setNotifyData([]);
    }
  }, [state?.profile]);

  return (
    <header className={styles.zingHeader}>
      <div className={styles.headerCenter}>
        <Search />
      </div>
      <div className={styles.headerRight}>
        {/* <img src="/Group 24.svg" alt="" /> */}
        {profileData?.is_vip != 1 && (
          <button
            className="border border-yellow-400 text-[13px] px-[10px] py-[4px] rounded-[100px] font-semiBold text-yellow-400"
            onClick={() => {
              if (profileData)
                dispatch({ type: "SHOW_VIP", payload: !state?.showVIP });
              else dispatch({ type: "SHOW_LOGIN", payload: !state?.showLogin });
            }}
          >
            Nâng cấp tài khoản
          </button>
        )}
        {profileData?.is_vip == 1 && (
          <div className="border border-yellow-400 text-[13px] px-[10px] py-[4px] rounded-[100px] font-semiBold text-yellow-400 select-none cursor-default">
            Quyền hạn VIP
          </div>
        )}
        {/* <Link href="/notify">
          <ReactSVG src="/Group 283.svg" />
        </Link> */}
        <div className="relative">
          {/* Button */}
          <button
            onClick={() => {
              if (state?.profile) setIsOpenNotify(!isOpenNotify);
              else {
                dispatch({ type: "SHOW_LOGIN", payload: true });
              }
            }}
            className={clsx("p-2 rounded-full", styles.notifyBtn, {
              [styles.active]: isOpenNotify,
            })}
          >
            <ReactSVG src="/Group 283.svg" className="w-6 h-6" />
          </button>

          {/* Layout */}
          {isOpenNotify && (
            <div
              className="absolute right-0 mt-2 w-80 shadow-lg rounded-lg backdrop-blur-[9px]"
              style={{ backgroundColor: "rgba(18, 18, 18, .9" }}
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-300">
                  Thông báo của bạn
                </h2>
                <button
                  onClick={() => setIsOpenNotify(false)}
                  className="absolute top-4 right-2 text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <ul
                className="divide-y divide-[transparent] max-h-[350px] min-h-[100px] overflow-auto"
                style={{
                  scrollbarWidth: "none", // Ẩn scrollbar trên Firefox
                  msOverflowStyle: "none", // Ẩn scrollbar trên IE/Edge cũ
                }}
              >
                {notifyData.length <= 1 && (
                  <p className="p-4 text-sm font-medium text-nowrap text-ellipsis w-full overflow-hidden text-gray-400">
                    Không có thông báo{" "}
                  </p>
                )}
                {notifyData.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      className="p-4 bg-transparent hover:bg-[#00000080] transition duration-300 ease-in-out block pr-[32px] pl-[60px] relative group relative"
                      href={item.url}
                      title={item.msg}
                    >
                      <img
                        src="/default.png"
                        alt=""
                        className="h-[40px] w-[40px] left-[10px]  absolute rounded-full"
                      />
                      <p className="text-sm font-medium text-wrap text-ellipsis w-full overflow-hidden text-gray-400">
                        {item.msg}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTimeFromNow(item.time)}
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="rgba(255, 255, 255, .3)"
                        className="opacity-0 size-6 w-[18px] absolute top-[50%] right-2 group-hover:opacity-100"
                        style={{ transform: "translateY(-50%)" }}
                      >
                        <path
                          strokeLinecap="round"
                          stroke-linejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        {state?.profile && (
          <div className={styles.settingsContainer}>
            {isLoggedIn ? (
              <>
                <img
                  src={
                    profileData?.url_avatar
                      ? profileData.url_avatar
                      : "/Setting.svg"
                  }
                  className={styles.avt}
                  alt="Settings"
                  onClick={toggleDropdown}
                  style={{ cursor: "pointer" }}
                />

                {showDropdown && (
                  <div className={styles.dropdownMenu}>
                    <ul>
                      <li onClick={closeDropdown}>
                        <Link href="/profile">Tài Khoản</Link>
                      </li>
                      <li onClick={closeDropdown}>
                        <button
                          onClick={() => {
                            dispatch({
                              type: "SHOW_CHANGE_PASSWORD",
                              payload: true,
                            });
                          }}
                        >
                          Đổi mật khẩu
                        </button>
                      </li>
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
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
        )}
        {!state?.profile && (
          <button
            onClick={() => dispatch({ type: "SHOW_LOGIN", payload: true })}
            className="cursor-pointer bg-[#407DC6] text-[13px] px-[10px] py-[4px] rounded-[100px] font-semiBold text-white select-none cursor-default"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
