"use client";
import React, { useState } from 'react';
import FavoriteMusicPage from './favoritemusic/page';
import FavoriteAlbumPage from './favoritealbum/page'; 
import style from './favorite.module.scss';


const FavoritePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'music' | 'album'>('music');

    return (
        <div className={style.favoritePage}>
            <h1>Trang yêu thích</h1>
            <div className={style.tabContainer}>
                <button
                    className={activeTab === 'music' ? style.activeTab : ''}
                    onClick={() => setActiveTab('music')}
                >
                    BÀI HÁT
                </button>
                <button
                    className={activeTab === 'album' ? style.activeTab : ''}
                    onClick={() => setActiveTab('album')}
                >
                    ALBUM
                </button>
            </div>

            <div className={style.contentContainer}>
                {activeTab === 'music' ? <FavoriteMusicPage /> : <FavoriteAlbumPage />}
            </div>
        </div>
    );
};

export default FavoritePage;
