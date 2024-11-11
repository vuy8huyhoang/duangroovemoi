
"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./FavoriteAlbum.module.scss";
import Link from "next/link";
import FavoritePage from "../page";


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
                console.log('Favorite Album Data:', response.result);


                

              setFavoriteAlbums(response.result.data);
              console.log('After setFavoriteAlbums, favoriteAlbums:', favoriteAlbums);
            } catch (error:any) {
                console.error("Failed to fetch favorite albums", error);
            }
        };
        fetchFavoriteAlbums();
    }, []);

    return (
        <div className={style.favoritePage}>
            <div className={style.albumGrid}>
                {favoriteAlbums.length === 0 ? (
                    <p>Không có album yêu thích.</p>
                ) : (
                    favoriteAlbums.map((album) => {
                        console.log('Rendering album:', album); // Kiểm tra từng album trước khi render
                        return (
                            <div key={album.id_album} className={style.albumItem}>
                                <img src={album.url_cover || "/default-cover.png"} alt={album.name} />
                                <p>{album.name}</p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
    

};

export default FavoriteAlbumPage;
