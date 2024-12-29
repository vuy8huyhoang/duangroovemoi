"use client";
import Sidebar from "./component/sidebar";
import "./globals.scss";
import Header from "./component/header/Header";
import { usePathname } from "next/navigation";
import AdminSidebar from "./admin/AdminSidebar";
import AdminHeader from "./admin/AdminHeader";
import MusicPlayer from "./component/musicplayer";
import { createContext, useEffect, useReducer } from "react";
import { initialState, reducer } from "./global";
import ProtectRoute from "./ProtectRoute";
import RightSidebar from "./component/rightsidebar/rightsidebar";
import VipOverlay from "./VipOverlay";
import Login from "./component/auth";
import ChangePasswordPage from "./change-password";
import PlaylistLayer from "./PlaylistLayer";

export const AppContext = createContext<any>(undefined);

export default function Layout({ children }: any) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [state, dispatch] = useReducer(reducer, initialState);

  if (typeof window !== "undefined") {
    if (!localStorage.getItem("currentPlaylist")) {
      localStorage.setItem("currentPlaylist", JSON.stringify([]));
    }
  }

  return (
    <html lang="en">
      <head>
        <title>Groove</title>
        <meta name="description" content="Soundy website description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body>
        <AppContext.Provider value={{ state, dispatch }}>
          <ProtectRoute />
          {!isAdmin ? (
            <div className="main w-full">
              <Sidebar />
              <Header />
              {state?.showLogin && <Login />}
              {state?.showVIP && <VipOverlay />}
              {state?.showChangePassword && <ChangePasswordPage />}
              <MusicPlayer />
              {state?.playlistLayer && <PlaylistLayer />}
              <div className="contain">{children}</div>
              {state?.currentPlaylist && state?.currentPlaylist?.length > 0 && (
                <RightSidebar />
              )}
            </div>
          ) : (
            // authguard && (
            <div className="flex">
              <AdminSidebar />
              <div
                className="px-[40px] bg-gray-100"
                style={{
                  width: state?.adminSidebar
                    ? "calc(100% - 240px)"
                    : "calc(100% - 80px)",
                }}
              >
                <AdminHeader />
                <div className="mt-[96px] min-h-[clsx(100vh - 96px)]">
                  {children}
                </div>
              </div>
            </div>
            // )
          )}
        </AppContext.Provider>
      </body>
    </html>
  );
}
