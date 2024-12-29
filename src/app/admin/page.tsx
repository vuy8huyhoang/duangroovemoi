"use client";
import React, { useEffect, useState } from "react";
import styles from "./admin.module.scss";
import axios from "@/lib/axios";
import Chart from "./chart/chart";
import ChartRanking from "./chartranking/chart";
import clsx from "clsx";

export default function AdminDashboard() {
  const [album, setAlbum] = useState<number>(0);
  const [music, setMusic] = useState<number>(0);
  const [artist, setArtist] = useState<number>(0);
  const [user, setUser] = useState<number>(0);
  const [vipUser, setVipUser] = useState<number>(0);
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
    axios
      .get("/music")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          setMusic(response.result.data.length);
        }
      })
      .catch((error: any) => console.error("Error fetching music:", error));

    axios
      .get("/artist")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          setArtist(response.result.data.length);
        }
      })
      .catch((error: any) => console.error("Error fetching artists:", error));

    axios
      .get("/album")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          setAlbum(response.result.data.length);
        }
      })
      .catch((error: any) => console.error("Error fetching albums:", error));

    axios
      .get("/user")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          setUser(response.result.data.length);
          setVipUser(response.result.data.filter((i) => i.is_vip === 0).length);
        }
      })
      .catch((error: any) => console.error("Error fetching users:", error));

    axios
      .get("/composer")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          setComposer(response.result.data.length);
        }
      })
      .catch((error: any) => console.error("Error fetching composers:", error));
  };

  const checkForNewData = () => {
    axios
      .get("/music")
      .then((response: any) => {
        if (response && response.data) {
          const newMusicCount = response.data.length;
          if (newMusicCount > music) {
            setNotifications((prev) => [
              ...prev,
              `Có ${newMusicCount - music} bài hát mới được thêm`,
            ]);
          }
          setMusic(newMusicCount);
        }
      })
      .catch((error: any) => console.error("Error fetching music:", error));

    axios
      .get("/user")
      .then((response: any) => {
        if (response && response.data) {
          const newUserCount = response.data.length;
          if (newUserCount > user) {
            setNotifications((prev) => [
              ...prev,
              `${newUserCount - user} người dùng mới đăng ký`,
            ]);
          }
          setUser(newUserCount);
        }
      })
      .catch((error: any) => console.error("Error fetching users:", error));

    axios
      .get("/album")
      .then((response: any) => {
        if (response && response.data) {
          const newAlbumCount = response.data.length;
          if (newAlbumCount > album) {
            setNotifications((prev) => [
              ...prev,
              `Có ${newAlbumCount - album} album mới được thêm`,
            ]);
          }
          setAlbum(newAlbumCount);
        }
      })
      .catch((error: any) => console.error("Error fetching albums:", error));

    axios
      .get("/artist")
      .then((response: any) => {
        if (response && response.data) {
          const newArtistCount = response.data.length;
          if (newArtistCount > artist) {
            setNotifications((prev) => [
              ...prev,
              `Có ${newArtistCount - artist} nghệ sĩ mới`,
            ]);
          }
          setArtist(newArtistCount);
        }
      })
      .catch((error: any) => console.error("Error fetching artists:", error));

    axios
      .get("/composer")
      .then((response: any) => {
        if (response && response.data) {
          const newComposerCount = response.data.length;
          if (newComposerCount > composer) {
            setNotifications((prev) => [
              ...prev,
              `Có ${newComposerCount - composer} nhạc sĩ mới`,
            ]);
          }
          setComposer(newComposerCount);
        }
      })
      .catch((error: any) => console.error("Error fetching composers:", error));
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white shadow rounded-lg flex items-center p-4 ">
          <div className="text-blue-500 text-3xl flex-shrink-0 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              TỔNG BÀI HÁT
            </h3>
            <p className="text-gray-600">
              {music ? `${music} bài hát` : "Đang tải..."}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg flex items-center p-4">
          <div className="text-green-500 text-3xl flex-shrink-0 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              TỔNG NGHỆ SĨ
            </h3>
            <p className="text-gray-600">
              {artist ? `${artist} nghệ sĩ` : "Đang tải..."}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg flex items-center p-4">
          <div className="text-red-500 text-3xl flex-shrink-0 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">TỔNG ALBUM</h3>
            <p className="text-gray-600">
              {album ? `${album} album` : "Đang tải..."}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg flex items-center p-4">
          <div className="text-yellow-500 text-3xl flex-shrink-0 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              TỔNG NGƯỜI DÙNG
            </h3>
            <p className="text-gray-600">
              {user ? `${user} người dùng` : "Đang tải..."}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg flex items-center p-4">
          <div className="text-purple-500 text-3xl flex-shrink-0 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
              <path
                fillRule="evenodd"
                d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
                clipRule="evenodd"
              />
              <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Doanh thu</h3>
            <p className="text-gray-600">
              {composer ? `${composer} VNĐ` : "Đang tải..."}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg flex items-center p-4">
          <div className="text-cyan-500 text-3xl flex-shrink-0 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              NGƯỜI DÙNG VIP
            </h3>
            <p className="text-gray-600">
              {vipUser ? `${vipUser} người dùng` : "Đang tải..."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid my-6 grid-cols-12 w-full gap-4">
        <div className="col-span-6 bg-white shadow-md rounded-md">
          <h3 className="text-base font-semibold text-gray-800 mb-4 p-4 pb-0">
            Biểu đồ lượt xem trong 30 ngày
          </h3>
          <Chart />
        </div>
        <div className="col-span-6 bg-white shadow-md rounded-md p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Biểu đồ top bài hát nhiều lượt xem nhất
          </h3>
          <ChartRanking />
        </div>
      </div>
    </div>
  );
}
