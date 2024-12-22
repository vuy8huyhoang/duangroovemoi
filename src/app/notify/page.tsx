"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "./notify.module.scss";
import Link from "next/link";

interface Notification {
  msg: string;
  url: string;
  time: string;
}

export default function Notify() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/notification")
      .then((response: any) => {
        console.log("dữ liệu của thông báo", response);

        if (response?.result?.data) {
          setNotifications(response.result.data);
        } else {
          console.error("Dữ liệu phản hồi không xác định hoặc null", response);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi khi lấy thông báo", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p className={styles.loading}>Đang tải thông báo...</p>;

  return (
    <div className={styles.notificationContainer}>
      <h3 className={styles.title}>Thông báo</h3>
      {notifications.length > 0 ? (
        <ul className={styles.notificationList}>
          {notifications.map((notification, index) => (
            <li key={index} className={styles.notificationItem}>
              <p>
                <strong>Nội dung:</strong> {notification.msg}
              </p>
              <p>
                <strong>Thời gian:</strong>{" "}
                {new Date(notification.time).toLocaleString("vi-VN")}
              </p>
              {notification.url && (
                <p>
                  <Link
                    href={notification.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Xem chi tiết
                  </Link>
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noNotifications}>Không có thông báo nào.</p>
      )}
    </div>
  );
}
