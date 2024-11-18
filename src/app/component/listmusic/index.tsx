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
    const [viewCounts, setViewCounts] = useState<{ [key: number]: number }>({});
    const [menuVisible, setMenuVisible] = useState<number | null>(null); // State mới cho menu
    const [submenuVisible, setSubmenuVisible] = useState<number | null>(null); // State cho menu phụ
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const router = useRouter();
    

    const { state, dispatch } = useContext(AppContext);

      

    useEffect(() => {
        // Lấy danh sách bài hát
        axios.get("/music")
            .then((response: any) => {
                if (response?.result?.data) {
                    setAlbums(response.result.data.slice(0, 6));
                }
            })
            .catch((error: any) => console.error("Error fetching albums:", error));

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
                                    // await addMusicToHistory(album.id_music, 100);

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
