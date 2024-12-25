"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./followed.module.scss";
import Link from "next/link";
import clsx from "clsx";
import { Img } from "react-image";

interface FollowedArtist {
  id_artist: string;
  name: string;
  url_cover: string;
}

const FollowedPage = () => {
  const [followedArtist, setFollowedArtist] = useState<FollowedArtist[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchFollowArtist = async () => {
      try {
        const response: any = await axios.get("/follow/me");
        // console.log('Favorite Album Data:', response.result);
        setFollowedArtist(response.result.data);
        //   console.log('After setFavoriteAlbums, favoriteAlbums:', followedArtist);
      } catch (error: any) {
        console.error("Failed to fetch favorite albums", error);
      }
    };
    fetchFollowArtist();
  }, []);

  return (
    <div className={style.contentwrapper}>
      <h2 className="home__heading home__heading__noMargin">Đang theo dõi</h2>
      <div className="grid grid-cols-12 gap-[16px] flex-wrap">
        {followedArtist.length === 0 ? (
          <p className="col-span-12 text-gray-500">Chưa theo dõi nghệ sĩ</p>
        ) : (
          (showAll ? followedArtist : followedArtist.slice(0, 4)).map(
            (artist) => {
              //   console.log("Rendering artist:", artist); // Kiểm tra từng album trước khi render
              return (
                <div
                  key={artist.id_artist}
                  className={clsx(style.artistItem, "col-span-2")}
                >
                  <div className={style.artistFollow}>
                    <Link href={`/artistdetail/${artist.id_artist}`}>
                      <Img
                        src={artist.url_cover} // URL ảnh từ album
                        alt={artist.name}
                        className={"object-cover aspect-square"}
                        // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                        unloader={
                          <img
                            src="/default.png"
                            alt="default"
                            className={"object-cover aspect-square"}
                          />
                        } // Thay thế ảnh khi lỗi
                      />
                    </Link>
                    <p>{artist.name}</p>
                  </div>
                </div>
              );
            }
          )
        )}
      </div>
      {followedArtist.length > 5 && (
        <button className={style.button} onClick={() => setShowAll(!showAll)}>
          {showAll ? "Ẩn bớt" : "Hiện tất cả"}
        </button>
      )}
    </div>
  );
};

export default FollowedPage;
