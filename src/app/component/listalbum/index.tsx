import { useEffect, useState, useRef } from 'react';
import axios from '@/lib/axios';
import style from './listalbum.module.scss';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';

interface Album {
    id_album: string;
    name: string;
    url_cover: string;
    musics: {
        id_music: string;
        name: string;
        url_path: string;
        composer: string;
    }[];
}

export default function ListAlbum() {
    const [albumData, setAlbumData] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSong, setCurrentSong] = useState<any>(null);

    useEffect(() => {
        axios.get("/album")
            .then((response: any) => {
                if (response && response.result && response.result.data) {
                    const albumObj = response.result.data;
                    setAlbumData(albumObj.slice(0, 5));
                } else {
                    console.error('Response result.data is undefined or null', response);
                }
            })
            .catch((error: any) => {
                console.error('Lỗi fetch album', error);
            })
            .finally(() => {
                setLoading(false); 
            });
    }, []);

    const handlePlayRandomClick = () => {
        if (isPlaying) {
            pausePlaying(); // Pause if currently playing
        } else {
            continuePlaying(); // Continue playing if paused
        }
    };

    const continuePlaying = () => {
        if (albumData.length > 0) {
            const randomAlbumIndex = Math.floor(Math.random() * albumData.length);
            const randomAlbum = albumData[randomAlbumIndex];
            if (randomAlbum.musics.length > 0) {
                const randomIndex = Math.floor(Math.random() * randomAlbum.musics.length);
                const randomSong = randomAlbum.musics[randomIndex];
                setCurrentSong(randomSong);
                audioRef.current.src = randomSong.url_path; // Set audio source
                audioRef.current.play(); // Play the song
                setIsPlaying(true);
            } else {
                console.log('No songs available to play.');
            }
        } else {
            console.log('No albums available to play.');
        }
    };

    const pausePlaying = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    return (
        <>
            <div className={style.headerSection}>
                <h2>Chill</h2>
                <div className={style.all}>
                    <a href="#" className={style.viewAllButton}>Tất cả</a>
                    <ReactSVG className={style.csvg} src="/all.svg" />
                </div>
            </div>

            <div className={style.albumGrid}>
                {loading ? (
                    <p>Đang tải album...</p>
                ) : (
                    albumData.map((album) => (
                        <div key={album.id_album} className={style.albumCard}>
                            <div className={style.albumWrapper}>
                                <img src={album.url_cover} alt={album.name} className={style.albumCover} />
                                <div className={style.overlay}>
                                    <button className={style.likeButton}>
                                        <ReactSVG src="/heart.svg" />
                                    </button>
                                    <button className={style.playButton} onClick={handlePlayRandomClick}>
                                        {isPlaying ? <ReactSVG src="/pause.svg" /> : <ReactSVG src="/play.svg" />}
                                    </button>
                                    <button className={style.moreButton}>
                                        <ReactSVG src="/more.svg" />
                                    </button>
                                </div>
                            </div>
                            <Link href={`/albumdetail/${album.id_album}`} className={style.albumTitle}>
                                {album.name}
                            </Link>
                        </div>
                    ))
                )}
                <audio ref={audioRef} />
            </div>
        </>
    );
}