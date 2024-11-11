"use client";
import Sidebar from './component/sidebar';
import "./globals.css";
import Header from './component/header/Header';
import { usePathname } from 'next/navigation';
import AdminSidebar from './component/AdminSidebar';
import AdminHeader from './component/AdminHeader';
import MusicPlayer from './component/musicplayer';
import { createContext, useReducer } from 'react';
import { initialState, reducer } from "./global";
import useAuthGuard from './admin/authguard/authguard';

export const AppContext = createContext<any>(undefined);
export default function Layout({ children }: any) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [state, dispatch] = useReducer(reducer, initialState);
  useAuthGuard();
  
  return (
    <html lang="en">
      <head>
        <title>Groove</title>
        <meta name="description" content="Soundy website description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body>
        <AppContext.Provider value={{ state, dispatch }}>
          {!isAdmin ? (
            <div className="container">
              <Sidebar />
              <Header />
              <MusicPlayer />

              <div className="contain">
                {children}
              </div>
            </div>
          ) : (
            <div className="admin-container">
              <AdminSidebar />

              <div className="admin-content">
                <AdminHeader />
                {children}
              </div>


            </div>
          )}
        </AppContext.Provider>
      </body>
    </html>
  );
}
