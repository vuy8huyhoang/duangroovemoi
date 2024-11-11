"use client";
import styles from './home.module.scss'; 
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import ListMusic from '../listmusic';
import ListAlbum from '../listalbum';
import ListMusicTop from '../listmusictop';
import ListType from '../listtype';
import AlbumHot from '../albumhot';
import MusicPartner from '../musicpartner';
interface Album {
    id_album: string;
    name: string;
    url_cover: string;
}

export default function Home() {
    const [albumData, setAlbumData] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/album')
            .then((response: any) => {
                console.log('Full API response:', response); 
                if (response && response.result && response.result.data) {
                    setAlbumData(response.result.data.slice(0, 3)); 
                } else {
                    console.error('Response result.data is undefined or null:', response);
                    setAlbumData([]); 
                }
            })
            .catch((error: any) => {
                console.error('Lỗi fetch album:', error);
                setAlbumData([]);
            })
            .finally(() => {
                setLoading(false); 
            });
    }, []);

    return (<>
        <div className={styles.contentwrapper}>
            <div className={styles.albumList}>
                {albumData.map((album) => (
                    <div key={album.id_album} className={styles.albumCard}>
                        <img src={album.url_cover} alt={album.name} className={styles.albumCover} />
                    </div>
                ))}
            </div>
            
            
        </div>
        <ListMusic />
        <ListAlbum />
        <ListMusicTop />
        <ListType />
        <AlbumHot />
        <MusicPartner/>
    </>
    );
}
