"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./FavoriteMusic.module.scss";
import Link from "next/link";
import FavoritePage from '../page';

interface FavoriteMusic {
  id_music: string;
  name: string;
  url_cover: string;
}

const FavoriteMusicPage = () => {
  const [favoriteMusic, setFavoriteMusic] = useState<FavoriteMusic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteMusic = async () => {
      try {
        const response:any = await axios.get("/favorite-music/me");
        console.log('Favorite Music Data:', response.result); 
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
      
      <div className={style.musicGrid}>
        {favoriteMusic.map((music) => (
          <div key={music.id_music} className={style.musicItem}>
            <img
              src={music.url_cover || "/default-cover.png"}
              alt={music.name}
            />
            <Link href={`/musicdetail/${music.id_music}`}>
              {music.name}
            </Link>
         
            
            {/* <p>Lượt xem: {viewCounts[history.id_music] || 0}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteMusicPage;
