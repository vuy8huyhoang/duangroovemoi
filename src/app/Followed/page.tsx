
"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from './followed.module.scss';
import Link from "next/link";




interface FollowedArtist {
    id_artist: string;
    name: string;
    url_cover: string;
}

const FollowedPage = () => {
    const [followedArtist, setFollowedArtist] = useState<FollowedArtist[]>([]);

    useEffect(() => {
        const fetchFollowArtist = async () => {
            try {
                const response: any = await axios.get("/follow/me");
                console.log('Favorite Album Data:', response.result);
                setFollowedArtist(response.result.data);
              console.log('After setFavoriteAlbums, favoriteAlbums:', followedArtist);
            } catch (error:any) {
                console.error("Failed to fetch favorite albums", error);
            }
        };
        fetchFollowArtist();
    }, []);

    return (
        <div className={style.contentwrapper}>
             <h2>Nghệ Sĩ Yêu Thích</h2>
            <div className={style.followed}>
           
                {followedArtist.length === 0 ? (
                    <p>Không có album yêu thích.</p>
                ) : (
                    followedArtist.map((artist) => {
                        console.log('Rendering artist:', artist); // Kiểm tra từng album trước khi render
                        return (
                            <div key={artist.id_artist} className={style.artistItem}>
                                <div className={style.artistFollow}>
                                <Link href={`/artistdetail/${artist.id_artist}`}><img src={artist.url_cover} alt={artist.name} /></Link>
                                <p>{artist.name}</p>
                                </div>
                              
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
    

};

export default FollowedPage;
