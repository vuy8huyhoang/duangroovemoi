import React, { useState, useEffect, useContext } from "react";
import styles from "./AdminSidebar.module.scss";
import Link from "next/link";
import { ReactSVG } from "react-svg";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import axios from "@/lib/axios";
import { AppContext } from "@/app/layout";

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
  const pathname = usePathname();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const { state, dispatch } = useContext(AppContext);
  // const [loading, setLoading] = useState(true);    console.log(profileData)

  useEffect(() => {
    axios
      .get("profile")
      .then((response: any) => {
        // console.log(response);

        if (response && response.result.data) {
          setProfileData(response.result.data);
        } else {
          console.error("Response data is undefined or null", response);
        }
      })
      .catch((error: any) => {
        console.error("Error fetching profile details", error);
      })
      .finally(() => {
        // setLoading(false);
      });
  }, []);

  return (
    <>
      <div
        className={clsx(
          styles.sidebar,
          "w-[240px] p-[10px] fixed top-0 bottom-0 left-0 bg-white shadow z-50",
          { "!w-[80px]": !state?.adminSidebar }
        )}
      >
        <div
          className={clsx(
            "p-[20px] mb-[30px] flex items-center justify-center min-h-[130px] transition duration-400 ease-in-out",
            { "!px-0": !state?.adminSidebar }
          )}
        >
          <img
            className={styles.avatar}
            src={profileData?.url_avatar ? profileData.url_avatar : "/logo.svg"}
            alt="User Avatar"
          />
        </div>

        <ul className="flex flex-col gap-1">
          <li
            className={clsx(styles.sidebarItem, {
              [styles.expand]: !state?.adminSidebar,
              [styles.active]: pathname === "/admin",
            })}
          >
            <Link href="/admin" className="flex p-[10px] rounded-[10px]">
              <svg
                className="_icon_ieha2_7"
                width="21"
                height="22"
                viewBox="0 0 21 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.16667 11.766H8.16667C8.80833 11.766 9.33333 11.2407 9.33333 10.5986V1.25922C9.33333 0.617138 8.80833 0.0917969 8.16667 0.0917969H1.16667C0.525 0.0917969 0 0.617138 0 1.25922V10.5986C0 11.2407 0.525 11.766 1.16667 11.766ZM1.16667 21.1054H8.16667C8.80833 21.1054 9.33333 20.5801 9.33333 19.938V15.2683C9.33333 14.6262 8.80833 14.1009 8.16667 14.1009H1.16667C0.525 14.1009 0 14.6262 0 15.2683V19.938C0 20.5801 0.525 21.1054 1.16667 21.1054ZM12.8333 21.1054H19.8333C20.475 21.1054 21 20.5801 21 19.938V10.5986C21 9.95654 20.475 9.43119 19.8333 9.43119H12.8333C12.1917 9.43119 11.6667 9.95654 11.6667 10.5986V19.938C11.6667 20.5801 12.1917 21.1054 12.8333 21.1054ZM11.6667 1.25922V5.92892C11.6667 6.571 12.1917 7.09635 12.8333 7.09635H19.8333C20.475 7.09635 21 6.571 21 5.92892V1.25922C21 0.617138 20.475 0.0917969 19.8333 0.0917969H12.8333C12.1917 0.0917969 11.6667 0.617138 11.6667 1.25922Z"
                  fill="currentColor"
                ></path>
              </svg>
              <div>Dashboard</div>
            </Link>
          </li>
          <li
            className={clsx(styles.sidebarItem, {
              [styles.expand]: !state?.adminSidebar,
              [styles.active]: pathname === "/admin/music",
            })}
          >
            <Link href="/admin/music" className="flex p-[10px] rounded-[10px]">
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

              <div>Bài hát</div>
            </Link>
          </li>
          <li
            className={clsx(styles.sidebarItem, {
              [styles.expand]: !state?.adminSidebar,
              [styles.active]: pathname === "/admin/type",
            })}
          >
            <Link href="/admin/type" className="flex p-[10px] rounded-[10px]">
              <svg
                className="_icon_ieha2_7"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.3032 1.39628C9.91324 0.758213 8.98653 0.758213 8.5966 1.39628L4.60458 7.92868C4.19736 8.59503 4.67693 9.45013 5.45786 9.45013H13.4419C14.2228 9.45013 14.7024 8.59503 14.2952 7.92868L10.3032 1.39628Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M15.226 20.9999C17.8356 20.9999 19.9511 18.8845 19.9511 16.2749C19.9511 13.6653 17.8356 11.5498 15.226 11.5498C12.6165 11.5498 10.501 13.6653 10.501 16.2749C10.501 18.8845 12.6165 20.9999 15.226 20.9999Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M0 13.0752C0 12.5229 0.447715 12.0752 1 12.0752H7.40012C7.9524 12.0752 8.40012 12.5229 8.40012 13.0752V19.4753C8.40012 20.0276 7.9524 20.4753 7.40012 20.4753H1C0.447715 20.4753 0 20.0276 0 19.4753V13.0752Z"
                  fill="currentColor"
                ></path>
              </svg>
              <div>Thể loại</div>
            </Link>
          </li>
          <li
            className={clsx(styles.sidebarItem, {
              [styles.expand]: !state?.adminSidebar,
              [styles.active]: pathname === "/admin/album",
            })}
          >
            <Link href="/admin/album" className="flex p-[10px] rounded-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
              </svg>

              <div>Album</div>
            </Link>
          </li>
          <li
            className={clsx(styles.sidebarItem, {
              [styles.expand]: !state?.adminSidebar,
              [styles.active]: pathname === "/admin/artist",
            })}
          >
            <Link href="/admin/artist" className="flex p-[10px] rounded-[10px]">
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

              <div>Ca sĩ</div>
            </Link>
          </li>
          <li
            className={clsx(styles.sidebarItem, {
              [styles.expand]: !state?.adminSidebar,
              [styles.active]: pathname === "/admin/composer",
            })}
          >
            <Link
              href="/admin/composer"
              className="flex p-[10px] rounded-[10px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
              </svg>

              <div>Nhạc sĩ</div>
            </Link>
          </li>
          <li
            className={clsx(styles.sidebarItem, {
              [styles.expand]: !state?.adminSidebar,
              [styles.active]: pathname === "/admin/user",
            })}
          >
            <Link href="/admin/user" className="flex p-[10px] rounded-[10px]">
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

              <div>Người dùng</div>
            </Link>
          </li>
        </ul>
      </div>
      <div
        className={clsx("w-[240px]", styles.sidebar, {
          "!w-[80px]": !state?.adminSidebar,
        })}
      ></div>
    </>
  );
};

export default AdminSidebar;
