<<<<<<< HEAD
// import React, { useState, useEffect, useRef, useContext } from 'react';
// import axios from '@/lib/axios';
// import style from './listmusic.module.scss';
// import { ReactSVG } from 'react-svg';
// import Link from 'next/link';
// import PlaylistPage from '../../playlist/page';
// import { addMusicToTheFirst } from '../musicplayer';
// import { AppContext } from '@/app/layout';

// interface Mussic {
//     id_music: number;
//     name: string;
//     url_cover: string;
//     url_path: string;
//     artist: string;
//     genre: string;
//     release: string;
//     composer: string;
//     music:string;
//     musics:{
//        id_music: string
//     }
//     artists:any [
//     ]
// }

// interface MusicHistory {
//     id_music: string;
//     created_at: string;
//   }

// interface Playlist{
//     id_playlist:string;
//     id_music:string;
//     index_order: number;
//     name: string;
// }

// const ListMusic: React.FC = () => {
//     const [albums, setAlbums] = useState<Mussic[]>([]);
//     const [favoriteMusic, setFavoriteMusic] = useState<Set<number>>(new Set());
//     const [hoveredSong, setHoveredSong] = useState<number | null>(null);
//     const [activeFilter, setActiveFilter] = useState<string>('Tất cả');
//     const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
//     const [viewCounts, setViewCounts] = useState<{ [key: number]: number }>({});
//     const [menuVisible, setMenuVisible] = useState<number | null>(null); // State mới cho menu
//     const [submenuVisible, setSubmenuVisible] = useState<number | null>(null); // State cho menu phụ
//     const [playlists, setPlaylists] = useState<Playlist[]>([]);
//     const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
//     const audioRef = useRef<HTMLAudioElement | null>(null);
//     const { state, dispatch } = useContext(AppContext);
      

//     useEffect(() => {
//         axios.get('/music')
//             .then((response: any) => {
//                 if (response && response.result && response.result.data) {
//                     setAlbums(response.result.data.slice(0, 6));
//                 }
//             })
//             .catch((error: any) => console.error('Error fetching albums:', error));

//             axios
//       .get('/music-history/me')
//       .then((response: any) => {
//         setMusicHistory(response.result.data);
//       })
//       .catch((error: any) => console.error('Error fetching music history:', error));

//        // Lấy danh sách playlist từ API
//        axios.get('/playlist/me')
//        .then((response: any) => {
//            setPlaylists(response.result.data);
//        })
//        .catch((error: any) => console.error('Error fetching playlists:', error));

//   }, []);

  
//   useEffect(() => {
//     // Tính toán lượt xem dựa trên music history
//     const counts: { [key: number]: number } = {};
//     musicHistory.forEach((history) => {
//       const musicId = parseInt(history.id_music); // Convert id_music to number if needed
//       counts[musicId] = (counts[musicId] || 0) + 1;
//     });
//     setViewCounts(counts);
//   }, [musicHistory]);


//     const toggleFavorite = async (id_music: number) => {
//         const isFavorite = favoriteMusic.has(id_music);
//         setFavoriteMusic((prev) => {
//             const updated = new Set(prev);
//             isFavorite ? updated.delete(id_music) : updated.add(id_music);
//             return updated;
//         });

//         try {
//             if (isFavorite) {
//                 // Nếu đã là yêu thích, xóa khỏi yêu thích
//                 await axios.delete(`/favorite-music/me`, { data: { id_music } });
//             } else {
//                 // Nếu chưa yêu thích, thêm vào yêu thích
//                 await axios.post(`/favorite-music/me`, { id_music, favorite: true });
//             }
//         } catch (error) {
//             console.error('Lỗi khi cập nhật trạng thái yêu thích:', error);
//         }
//     };


//     const handleFilterClick = (filter: string) => setActiveFilter(filter);

//     const filteredAlbums = activeFilter === 'Tất cả'
//         ? albums
//         : albums.filter(album => album.genre === activeFilter);

//         const toggleMenu = (id: number) => {
//             setMenuVisible((prev) => (prev === id ? null : id));
//         };
//         const toggleSubmenu = (id: number) => {
//             setSubmenuVisible((prev) => (prev === id ? null : id));
//         };

        
//         const addToPlaylist = async (id_music, id_playlist: string, index_order: number) => 
            
//             {

//             try {
//               await axios.post('/playlist/add-music', { id_music, id_playlist, index_order });
//               alert(`Bài hát đã được thêm vào playlist!`);
//               console.log("dữ liệu đc thêm:", id_music, id_playlist, index_order );
              
//             } catch (error) {
//               console.error('Error adding to playlist:', error);
//               alert(`Lỗi khi thêm bài hát vào playlist.`);
//             }
//           };
          

//     return (
//         <>
//             <div className={style.headerSection}>
//                 <h2>Mới phát hành</h2>
//                 <div className={style.all}>
//                     <a href="#" className={style.viewAllButton}>Tất cả</a>
//                     <ReactSVG className={style.csvg} src="/all.svg" />
//                 </div>
//             </div>

//             <div className={style.filterBar}>
//                 {['Tất cả', 'Việt Nam', 'Quốc tế'].map((filter) => (
//                     <button
//                         key={filter}
//                         className={`${style.filter} ${activeFilter === filter ? style.active : ''}`}
//                         onClick={() => handleFilterClick(filter)}
//                     >
//                         {filter}
//                     </button>
//                 ))}
//             </div>

//             <div className={style.albumList}>
//                 {filteredAlbums.map((album) => {
//                     return (
//                         (
                    
//                             <div
//                                 key={album.id_music}
//                                 className={style.songCard}
//                                 onMouseEnter={() => setHoveredSong(album.id_music)}
//                                 onMouseLeave={() => setHoveredSong(null)}
//                             >
//                                 <div className={style.albumCoverWrapper}>
//                                     <img src={album.url_cover} alt={album.name} className={style.albumCover} />
//                                     <div className={style.overlay}>
//                                         <button
//                                             className={style.playButton}
//                                             onClick={() =>
//                                             {
//                                                 addMusicToTheFirst(
//                                                     state,
//                                                     dispatch,
//                                                     album.id_music as any,
//                                                     album.name,
//                                                     album.url_path,
//                                                     album.url_cover,
//                                                     album.composer,
//                                                     album.artists.map(artist => artist.artist)
//                                                 )
//                                                 if (album.id_music === state.currentPlaylist[0]?.id_music && state.isPlaying) {
//                                                     dispatch({
//                                                         type: "IS_PLAYING",
//                                                         payload: false
//                                                     })
//                                                      ;
//                                                 }
//                                                }
//                                             }
//                                         >
//                                             {album.id_music === state.currentPlaylist[0]?.id_music && state.isPlaying ? (
//                                                 <i className="fas fa-pause"></i>
//                                             ) : (
//                                                 <i className="fas fa-play"></i>
//                                             )}
//                                         </button>
//                                     </div>
//                                 </div>             
//                                 <div className={style.songInfo}>
//                                     <div className={style.songName}><Link href={`/musicdetail/${album.id_music}`}>{album.name}</Link></div>
//                                     <div className={style.composerName}><Link href={`/musicdetail/${album.id_music}`}>{album.composer}</Link></div>
//                                 </div>
//                                 <div className={style.songControls}>
//                                     <i 
//                                         className={`fas fa-heart ${favoriteMusic.has(album.id_music) ? style.activeHeart : ''}`}
//                                         onClick={() => toggleFavorite(album.id_music)}
//                                 ></i>
//                                     <i className="fas fa-ellipsis-h"
//                                     onClick={() => toggleMenu(album.id_music)} 
//                                     ></i>
//                                 </div>
//                                 {menuVisible === album.id_music && (
//                             <div className={style.menu}>
//                                 <button onClick={() => toggleSubmenu(album.id_music)}>Thêm vào playlist</button>
//                                 {submenuVisible === album.id_music && (
//                                     <div className={style.submenu}>
//                                 {playlists.map((playlist,index) => (
//                             <button
//                                 key={playlist.id_playlist}
//                                     onClick={() => addToPlaylist(album.id_music, playlist.id_playlist, playlist.index_order=index )}>

//                                     {playlist.name}
//                             </button>
//                             ))}
//                             </div>
//                             )}
//                                 <button onClick={() => console.log('Chia sẻ')}>Chia sẻ</button>
//                                 <button onClick={() => console.log('Tải về')}>Tải về</button>
//                             </div>
//                                 )}
                                
//                             </div>
//                         )
//                     )
//                 }
//                 )}

                      
//             </div>

//             <audio ref={audioRef}></audio>
//         </>
//     );
// };

// export default ListMusic;




import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "@/lib/axios";
import style from "./listmusic.module.scss";
import { addMusicToTheFirst } from "../musicplayer";
import { AppContext } from "@/app/layout";
import Link from 'next/link';
=======
"use client"

import React, { useState, useEffect, useRef, useContext } from 'react';

import axios from '@/lib/axios';
import style from './listmusic.module.scss';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';
import PlaylistPage from '../../playlist/page';

import { useRouter } from 'next/navigation';

import { addMusicToTheFirst } from '../musicplayer';
import { AppContext } from '@/app/layout';
>>>>>>> bd9a84fa8c57e5cc4d742b3f855867c57bbc84df


interface Mussic {
    id_music: string; // Đổi về string để phù hợp với dữ liệu API
    name: string;
    url_cover: string;
    url_path: string;
    composer: string;
    artists: any[];
}

interface MusicHistory {
    id_music: string;
    play_duration: number;
    created_at: string; // Thời gian bài hát được thêm vào lịch sử
}

const ListMusic: React.FC = () => {
    const [albums, setAlbums] = useState<Mussic[]>([]);
    const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
<<<<<<< HEAD
    const { state, dispatch } = useContext(AppContext);
=======
    const [viewCounts, setViewCounts] = useState<{ [key: number]: number }>({});
    const [menuVisible, setMenuVisible] = useState<number | null>(null); // State mới cho menu
    const [submenuVisible, setSubmenuVisible] = useState<number | null>(null); // State cho menu phụ
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const router = useRouter();
    

    const { state, dispatch } = useContext(AppContext);

      
>>>>>>> bd9a84fa8c57e5cc4d742b3f855867c57bbc84df

    useEffect(() => {
        // Lấy danh sách bài hát
        axios.get("/music")
            .then((response: any) => {
                if (response?.result?.data) {
                    setAlbums(response.result.data.slice(0, 6));
                }
            })
            .catch((error: any) => console.error("Error fetching albums:", error));

<<<<<<< HEAD
        // Lấy lịch sử nghe nhạc
        axios.get("/music-history/me")
            .then((response: any) => {
                setMusicHistory(response.result.data);
            })
            .catch((error: any) => console.error("Error fetching music history:", error));
    }, []);

    // Hàm thêm bài hát vào lịch sử nghe nhạc
    const addMusicToHistory = async (id_music: string, play_duration: number = 100) => {
=======
            axios
      .get('/music-history/me')
      .then((response: any) => {
        setMusicHistory(response.result.data);
      })
      .catch((error: any) => console.error('Error fetching music history:', error));

       // Lấy danh sách playlist từ API
       axios.get('/playlist/me')
       .then((response: any) => {
           setPlaylists(response.result.data);
       })
       .catch((error: any) => console.error('Error fetching playlists:', error));

  }, []);

  
  useEffect(() => {
    // Tính toán lượt xem dựa trên music history
    const counts: { [key: number]: number } = {};
    musicHistory.forEach((history) => {
      const musicId = parseInt(history.id_music); // Convert id_music to number if needed
      counts[musicId] = (counts[musicId] || 0) + 1;
    });
    setViewCounts(counts);
  }, [musicHistory]);


    const toggleFavorite = async (id_music: number) => {
        const isFavorite = favoriteMusic.has(id_music);
        setFavoriteMusic((prev) => {
            const updated = new Set(prev);
            if(isFavorite){
                updated.delete(id_music); 
            }else {
                updated.add(id_music);
            }
            return updated;
        });

        const isLoggedIn = localStorage.getItem('accessToken'); // Thay đổi theo cách bạn lưu token
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để yêu thích bài hát!');
            // router.push('/home');  // Chuyển hướng đến trang đăng nhập
            return;
        }

>>>>>>> bd9a84fa8c57e5cc4d742b3f855867c57bbc84df
        try {
            const response :any = await axios.post("/music-history/me", { id_music, play_duration });
            const newHistory: MusicHistory = response.result; // Dữ liệu trả về từ API

            // Cập nhật danh sách lịch sử nghe nhạc trên giao diện
            setMusicHistory((prevHistory) => [newHistory, ...prevHistory]);
            console.log("Đã thêm vào lịch sử nghe nhạc:", newHistory);
        } catch (error) {
            console.error("Lỗi khi thêm bài hát vào lịch sử nghe nhạc:", error);
        }
    };

    return (
        <div className={style.albumList}>
            {albums.map((album) => (
                <div key={album.id_music} className={style.songCard}>
                    <div className={style.albumCoverWrapper}>
                        <img src={album.url_cover} alt={album.name} className={style.albumCover} />
                        <div className={style.overlay}>
                            <button
                                className={style.playButton}
                                onClick={async () => {
                                    // Thêm bài hát vào danh sách phát
                                    addMusicToTheFirst(
                                        state,
                                        dispatch,
                                        album.id_music,
                                        album.name,
                                        album.url_path,
                                        album.url_cover,
                                        album.composer,
                                        album.artists.map((artist) => artist.artist)
                                    );

                                    // Gửi dữ liệu bài hát vào lịch sử
                                    await addMusicToHistory(album.id_music, 100);

                                    // Nếu bài hát đang phát, thì tạm dừng; nếu không, thì phát bài hát mới
                                    if (
                                        album.id_music === state.currentPlaylist[0]?.id_music &&
                                        state.isPlaying
                                    ) {
                                        dispatch({
                                            type: "IS_PLAYING",
                                            payload: false,
                                        });
                                    }
                                }}
                            >
                                {album.id_music === state.currentPlaylist[0]?.id_music && state.isPlaying ? (
                                    <i className="fas fa-pause"></i>
                                ) : (
                                    <i className="fas fa-play"></i>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className={style.songInfo}>
                    <div className={style.songName}><Link href={`/musicdetail/${album.id_music}`}>{album.name}</Link></div>
                 <div className={style.composerName}><Link href={`/musicdetail/${album.id_music}`}>{album.composer}</Link></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListMusic;
