
import { useContext, useEffect, useState } from 'react';
import axios from '@/lib/axios';
import style from './albumhot.module.scss'; // Import file CSS module
import { ReactSVG } from 'react-svg';
import Link from 'next/link';
import { addListMusicToTheFirst } from '../musicplayer';
import { AppContext } from '@/app/layout';
interface Album {
    id_album: number;
    name: string;
    url_cover: string;
    musics: {
        id_music: string;
        name: string;
        url_path: string;
        url_cover: string;
        composer: string;
        artists: { 
            id_artist:string;
            name: string;

         }[];
    }[];
}


export default function AlbumHot() {
    const [albumData, setAlbumData] = useState<Album[]>([]);
    const [favoriteAlbum, setFavoriteAlbum] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
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
            })  ;
    }, []);

    const toggleFavorite = async (id_album: number) => {
        const isFavorite = favoriteAlbum.has(id_album);
        setFavoriteAlbum((prev) => {
            const updated = new Set(prev);
            if (isFavorite) {
                updated.delete(id_album);
            } else {
                updated.add(id_album);
            }
            return updated;
        });

        if (typeof window !== "undefined") {

            const isLoggedIn = localStorage.getItem('accessToken'); // Thay đổi theo cách bạn lưu token
            if (!isLoggedIn) {
                alert('Vui lòng đăng nhập để yêu thích bài hát!');
                // router.push('/home');  // Chuyển hướng đến trang đăng nhập
                return;
            }
        }
    
        try {
            console.log(isFavorite ? "Xóa album khỏi yêu thích" : "Thêm album vào yêu thích");
            if (isFavorite) {
                await axios.delete(`/favorite-album/me`, { data: { id_album } });
            } else {
                await axios.post(`/favorite-album/me`, { id_album, favorite: true });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái yêu thích:', error);
            // Thông báo lỗi cho người dùng nếu cần
        }
    };

    return (
        <>
            <div className={style.headerSection}>
                <h2>Mới Phát Hành</h2>
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
                                <button className={style.likeButton} onClick={() => toggleFavorite(album.id_album)}>
                                    <ReactSVG src="/heart.svg" className={favoriteAlbum.has(album.id_album) ? style.activeHeart : ''} />
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
                                        composer: music?.composer,
                                        artists: Array.isArray(music?.artists) ? music.artists.map((artist) => ({
                                            id_artist: artist.id_artist,
                                            name: artist.name
                                        })) : [],
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
                            {album.musics[0]?.id_music === state.currentPlaylist[0]?.id_music && state.isPlaying ? (
                                <i className="fas fa-pause"></i>
                            ) : (
                                <i className="fas fa-play"></i>
                            )}
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
            </div>
        </>
    );
}
