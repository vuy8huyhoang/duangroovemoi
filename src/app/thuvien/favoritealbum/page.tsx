"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./FavoriteAlbum.module.scss";
import Link from "next/link";
import FavoritePage from "../favorites/page";
import clsx from "clsx";
import { Img } from "react-image";

interface FavoriteAlbum {
  id_album: string;
  name: string;
  url_cover: string;
}

const FavoriteAlbumPage = () => {
  const [favoriteAlbums, setFavoriteAlbums] = useState<FavoriteAlbum[]>([]);

  useEffect(() => {
    const fetchFavoriteAlbums = async () => {
      try {
        const response: any = await axios.get("/favorite-album/me");
        // console.log('Favorite Album Data:', response.result);

        setFavoriteAlbums(response.result.data);
        //   console.log('After setFavoriteAlbums, favoriteAlbums:', favoriteAlbums);
      } catch (error: any) {
        console.error("Failed to fetch favorite albums", error);
      }
    };
    fetchFavoriteAlbums();
  }, []);

  return (
    <div className={style.favoritePage}>
      <div className="grid grid-cols-12 gap-4 flex-wrap">
        {favoriteAlbums.length === 0 ? (
          <p className="col-span-12">Không có album yêu thích.</p>
        ) : (
          favoriteAlbums.map((album) => {
            // console.log("Rendering album:", album); // Kiểm tra từng album trước khi render
            return (
              <Link
                href={"/albumdetail/" + album.id_album}
                key={album.id_album}
                className={clsx(style.albumItem, "col-span-6")}
              >
                <Img
                  src={album.url_cover} // URL ảnh từ album
                  alt={album.name}
                  className={style.albumCover}
                  // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                  unloader={<img src="/default.png" alt="default" />} // Thay thế ảnh khi lỗi
                />
                <p>{album.name}</p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FavoriteAlbumPage;
