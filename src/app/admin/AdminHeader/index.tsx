import React, { useContext, useEffect } from "react";
import styles from "./AdminHeader.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import { AppContext } from "@/app/layout";
import axios from "@/lib/axios";
import { Img } from "react-image";

const AdminHeader: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    axios.get("profile").then((res: any) => {
      dispatch({ type: "PROFILE", payload: res.result.data });
    });
  }, []);

  return (
    <div
      className="fixed top-0 right-0 bg-white shadow z-10 h-[56px] px-[40px] flex justify-between items-center"
      style={{
        width: state?.adminSidebar ? "calc(100% - 240px)" : "calc(100% - 80px)",
      }}
    >
      <button
        onClick={() =>
          dispatch({ type: "ADMIN_SIDEBAR", payload: !state?.adminSidebar })
        }
        className="h-[46px] w-[46px] flex items-center justify-center hover:bg-gray-100 rounded-full shadow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div className="flex gap-4 items-center">
        <span className="text-[14px] text-gray-700 font-medium capitalize">
          {state?.profile?.fullname}
        </span>
        <Img
          src={state?.profile?.url_avatar}
          className="w-[32px] h-[32px] rounded-full object-cover border"
          unloader={
            <img
              src="/default_avatar.jpg"
              className="w-[32px] h-[32px] rounded-full object-cover border"
            />
          }
        ></Img>
      </div>
    </div>
  );
};

export default AdminHeader;
