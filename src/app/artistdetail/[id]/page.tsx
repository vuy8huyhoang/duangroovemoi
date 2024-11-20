"use client";
import { useEffect, useState,useRef, useContext } from 'react';
import axios from '@/lib/axios';
import style from './songdetail.module.scss';
import { addMusicToTheFirst } from '@/app/component/musicplayer';
import { AppContext } from '@/app/layout';

interface Artist {
    id_artist: string;
    name: string;
    url_cover: string;
    created_at: string;
    last_update: string;
    is_show: string;
    followers: string;
    description: string;
}

interface Music {
    id_music: string;
    name: string;
    genre: string;
    composer: string;
    url_path: string;
    url_cover: string;
    artists: any[];
}

export default function ArtistDetail({ params }) {
    const { id } = params; // Get id from URL params
    const [artist, setArtist] = useState<Artist | null>(null);
    const [musicList, setMusicList] = useState<Music[]>([]); // Lưu trữ danh sách bài hát của nghệ sĩ
    const [loading, setLoading] = useState(true);
    const [isFollowed, setIsFollowed] = useState<boolean>(false);
    const [hoveredSong, setHoveredSong] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSong, setCurrentSong] = useState<Music | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const { state, dispatch } = useContext(AppContext);

    // Lấy thông tin nghệ sĩ
    useEffect(() => {
        if (id) {
            axios.get(`artist/${id}`)
                .then((response:any) => {
                    if (response && response.result.data) {
                        setArtist(response.result.data);
                    } else {
                        console.error('Response data is undefined or null', response);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching artist details', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);
const handleFollowClick = (id_artist) => {
        axios.post(`/follow/me`, { id_artist })
            .then((response: any) => {
                console.log('Album followed successfully', response);
                setIsFollowed(true);
            })
            .catch((error: any) => {
                console.error('Error following album', error);
            });
    };
    const unFollowClick = (id_artist) => {
        axios.delete(`/follow/me?id_artist=${id_artist}`)
            .then((response: any) => {
                console.log('Album unfollowed successfully', response);
                setIsFollowed(false);
            })
            .catch((error: any) => {
                console.error('Error unfollowing album', error);
            });
    };


    // Lấy danh sách bài hát của nghệ sĩ
    useEffect(() => {
        if (id) {
            axios.get(`/music?id_artist=${id}`)
                .then((response:any) => {
                    if (response && response.result.data) {
                        setMusicList(response.result.data);
                    } else {
                        console.error('No music data found for artist', response);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching music list for artist', error);
                });
        }
    }, [id]);
    useEffect(() => {
        axios.get("follow/me")
            .then((response: any) => {
                console.log(response.result.data, artist)
                console.log(response.result.data.map(i => (i.id_artist)).includes(artist?.id_artist));

                if (response && response.result.data) {
                    if (response.result.data.map(i => (i.id_artist)).includes(artist?.id_artist)) {
                        setIsFollowed(true);
                    }

                } else {
                    console.error('Response data is undefined or null', response);
                }
            }
            )
    }, [id, artist]);
   

    const playSong = (music: Music) => {
        if (audioRef.current) {
            if (currentSong?.id_music === music.id_music && isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                setCurrentSong(music);
                audioRef.current.src = music.url_path; 
                audioRef.current.load(); // Đảm bảo src mới đã tải
                audioRef.current
                  .play()
                  .then(() => setIsPlaying(true))
                  .catch((error) => console.error("Lỗi khi phát audio:", error));
            }
        }
    };
    

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (!artist) {
        return <div>Không tìm thấy nghệ sĩ này.</div>;
    }

    return (
        <div className={style.contentwrapper}>
            <div className={style.containerHeroBody}>
                    <div className={style.left}>
                        <img
                            src={artist.url_cover}
                            alt={artist.name}
                        />
                    </div>
                    <div className={style.infomation}>
                        <div className={style.top}>{artist.name}</div>
                        <div className={style.bottom}>Followers:{artist.followers}</div>
                        {
                                isFollowed ? <button
                                    className={style.followButton}
                                    onClick={() => unFollowClick(artist.id_artist)}
                                > Đã Theo Dõi
                                </button> : <button
                                    className={style.followButton}
                                    onClick={() => handleFollowClick(artist.id_artist)}
                                > Theo Dõi </button>
                            }

                   
                    </div>
           
            </div>
           
            {/* <div className={style.cartartist}>
                <p><strong>Followers:</strong> {artist.followers}</p>
                <p><strong>Created at:</strong> {new Date(artist.created_at).toLocaleDateString()}</p>
                <p><strong>Last Update:</strong> {new Date(artist.last_update).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {artist.is_show === '1' ? 'Visible' : 'Hidden'}</p>
                <p><strong>Description:</strong> {artist.description}</p>
            </div> */}
            <h3 className={style.musicname}>Bài Hát Nổi Bật Của  {artist.name}</h3>
            {/* Hiển thị danh sách bài hát của nghệ sĩ */}
            <div className={style.cartMusic}>
               
                
                {musicList.length > 0 ? (
                    <ul>
                        {musicList.map((music) => (
                            <li key={music.id_music} className={style.songItem}>
                    <div
                        key={music.id_music}
                        className={`${style.songCard} ${hoveredSong === music.id_music ? style.hovered : ''}`}
                        onMouseEnter={() => setHoveredSong(music.id_music)}
                        onMouseLeave={() => setHoveredSong(null)}
                    >
                        <div className={style.image}>
                            <img src={music.url_cover} alt={music.name} className={style.musicCover} />
                            <div className={style.overlay}>
                                            <button
                                                className={style.playButton}
                                                onClick={() => {
                                                    addMusicToTheFirst(
                                                        state,
                                                        dispatch,
                                                        music.id_music as any,
                                                        music.name,
                                                        music.url_path,
                                                        music.url_cover,
                                                        music.composer,
                                                        music.artists.map(artist => artist.artist)
                                                    )
                                                    if (music.id_music === state?.currentPlaylist?.[0]?.id_music && state?.isPlaying) {
                                                        dispatch({
                                                            type: "IS_PLAYING",
                                                            payload: false
                                                        })
                                                            ;
                                                    }
                                                }
                                                }
                                            >
                                                {music.id_music === state?.currentPlaylist?.[0]?.id_music && state?.isPlaying ? (
                                                    <i className="fas fa-pause"></i>
                                                ) : (
                                                    <i className="fas fa-play"></i>
                                                )}
                                            </button>
                            </div>
                        </div>
                    </div>
                                    <span className={style.songTitle}>
                                        {music.name ? music.name : 'Chưa có tên bài hát'}
                                    </span>
                                   
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Không có bài hát nào cho nghệ sĩ này.</p>
                )}
            </div>
            <audio ref={audioRef} />
        </div>
    );
}
