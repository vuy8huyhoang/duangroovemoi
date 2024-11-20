import { useEffect, useState, useRef, useContext } from 'react';
import axios from '@/lib/axios';
import style from './listalbum.module.scss';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';
import { addListMusicToTheFirst } from '../musicplayer';
import { AppContext } from '@/app/layout';
import { log } from 'console';

interface Album {
    id_album: string;
    name: string;
    url_cover: string;
    musics: {
        id_music: string;
        name: string;
        url_path: string;
        url_cover: string;
        composer: string;
        id_composer: any;
        artists: { 
            artist: {
            id_artist:string;
            name: string;
            }
         }[];
    }[];
}

export default function ListAlbum() {
    const [albumData, setAlbumData] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSong, setCurrentSong] = useState<any>(null);
    const { state, dispatch } = useContext(AppContext);

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
                                    <button
                            className={style.playButton}
                            onClick={() => {
                                console.log(album, 'chúchsuchscschswkfwhbflwf');
                                let musicList = [];
                                album.musics.map(music => {
                                    musicList.push({
                                        id_music: music?.id_music,
                                        name: music?.name,
                                        url_path: music?.url_path,
                                        url_cover: music?.url_cover,
                                        composer: music?.id_composer?.name,
                                        artists: Array.isArray(music?.artists) ? music.artists.map((artist) => {                                            
                                            return {
                                                artist: {
                                                    id_artist: artist.artist.id_artist,
                                                    name: artist.artist.name
                                                }
                                        }}) : [],
                                    },)
                                })
                                
                               addListMusicToTheFirst(state, dispatch, musicList)
                               
// albumDetail?.musics.map(music => {
//     console.log(music);
//     addMusicToTheFirst(
//         state,
//         dispatch,
//         music?.id_music as any,
//         music?.name,
//         music?.url_path,
//         music?.url_cover,
//         music?.id_composer?.name,
//         music?.artists.map(artist => artist.artist),
//     )
// })
                                if (album.musics[0]?.id_music === state.currentPlaylist[0]?.id_music && state.isPlaying) {
                                    dispatch({
                                        type: "IS_PLAYING",
                                        payload: false
                                    })
                                     ;
                                }
                            }
                            }
                        >
                           
                                <i className="fas fa-play"></i>
                           
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