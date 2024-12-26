"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./FavoriteMusic.module.scss";
import Link from "next/link";
import FavoritePage from "../favorites/page";
import clsx from "clsx";
import { Img } from "react-image";
import { formatTimeFromNow } from "@/utils/String";

interface FavoriteMusic {
  id_music: string;
  name: string;
  url_cover: string;
  last_update: string;
}

const FavoriteMusicPage = () => {
  const [favoriteMusic, setFavoriteMusic] = useState<FavoriteMusic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteMusic = async () => {
      try {
        const response: any = await axios.get("/favorite-music/me");
        // console.log('Favorite Music Data:', response.result);
        setFavoriteMusic(response.result.data);
      } catch (error) {
        console.error("Failed to fetch favorite music", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavoriteMusic();
  }, []);
  if (loading) return <p>Loading...</p>;

  return (
    <div className={style.favoritePage}>
      <div className="grid grid-cols-12 gap-4 flex-wrap">
        {favoriteMusic.map((music) => (
          <Link
            href={"/musicdetail/" + music.id_music}
            key={music.id_music}
            className={clsx(style.musicItem, "col-span-6")}
          >
            <Img
              src={music.url_cover} // URL ảnh từ album
              alt={music.name}
              // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
              unloader={<img src="/default.png" alt="default" />} // Thay thế ảnh khi lỗi
            />
            <div className="flex flex-col gap-1">
              <Link
                href={`/musicdetail/${music.id_music}`}
                className="!text-[16px] !font-medium"
              >
                {music.name}
              </Link>
              {/* <Link href={`/musicdetail/${music.id_music}`}>{music.}</Link> */}

              <p>{formatTimeFromNow(music.last_update)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FavoriteMusicPage;
