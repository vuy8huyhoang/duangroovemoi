"use client";
import axios from "@/lib/axios";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AppContext } from "../layout";

const ProtectRoute = () => {
  const { state, dispatch } = useContext(AppContext);
  const pathname = usePathname();
  const router = useRouter();

  const goBack = () => {
    router.push("/");
    dispatch({ type: "SHOW_LOGIN", payload: true });
  };

  const userAuth = () => {
    // console.log("User middle...");
    if (typeof window !== "undefined") {
      if (localStorage.getItem("accessToken")) {
        axios("/profile").then((res: any) => {
          if (res.status !== 200) {
            // console.log("chưa đăng nhập");
            localStorage.removeItem("accessToken");
            goBack();
          } else {
            // console.log("Đã đăng nhập");
          }
        });
      } else {
        goBack();
      }
    }
  };

  const adminAuth = () => {
    // console.log("Admin middle...");
    if (typeof window !== "undefined") {
      if (localStorage.getItem("accessToken")) {
        axios("/profile").then((res: any) => {
          if (res.status !== 200) {
            localStorage.removeItem("accessToken");
            goBack();
          }
          if (res.result.data.role !== "admin") {
            goBack();
          }
        });
      } else {
        goBack();
      }
    }
  };

  const protectRoute = () => {
    const relativeUserRoutes = [];
    const relativeAdminRoutes = [];

    if (
      relativeUserRoutes.includes(pathname) ||
      pathname.startsWith("/thuvien") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/playlist") ||
      pathname.startsWith("/historymusic") ||
      pathname.startsWith("/notify") ||
      pathname.startsWith("/favorites")
    ) {
      return userAuth();
    } else if (
      relativeAdminRoutes.includes(pathname) ||
      pathname.startsWith("/admin")
    ) {
      return adminAuth();
    } else {
      // dispatch({ type: "SHOW_LOGIN", payload: false });
    }
  };

  // const pathname = usePathname();
  useEffect(() => {
    protectRoute();
  }, [pathname]);

  return <></>;
};

export default ProtectRoute;
