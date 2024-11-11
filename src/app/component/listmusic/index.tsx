import React, { useState, useEffect, useRef } from 'react';
import axios from '@/lib/axios';
import style from './listmusic.module.scss';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';

interface Mussic {
    id_music: number;
    name: string;
    url_cover: string;
    url_path: string;
    artist: string;
    genre: string;
    release: string;
    composer: string;
    music:string;
    musics:{
       id_music: string
    }
}
interface MusicHistory {
    id_music: string;
    created_at: string;
  }

const ListMusic: React.FC = () => {
    const [albums, setAlbums] = useState<Mussic[]>([]);
    const [favoriteMusic, setFavoriteMusic] = useState<Set<number>>(new Set());
    const [currentSong, setCurrentSong] = useState<Mussic | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [hoveredSong, setHoveredSong] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('Tất cả');
    const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
    const [viewCounts, setViewCounts] = useState<{ [key: number]: number }>({});
    const [menuVisible, setMenuVisible] = useState<number | null>(null); // State mới cho menu
    const [playlists, setPlaylists] = useState<{ id_playlist: number, name: string }[]>([]); // Dữ liệu playlist
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
      

    useEffect(() => {
        axios.get('/music')
            .then((response: any) => {
                if (response && response.result && response.result.data) {
                    setAlbums(response.result.data.slice(0, 6));
                }
            })
            .catch((error: any) => console.error('Error fetching albums:', error));

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
            isFavorite ? updated.delete(id_music) : updated.add(id_music);
            return updated;
        });

        try {
            if (isFavorite) {
                // Nếu đã là yêu thích, xóa khỏi yêu thích
                await axios.delete(`/favorite-music/me`, { data: { id_music } });
            } else {
                // Nếu chưa yêu thích, thêm vào yêu thích
                await axios.post(`/favorite-music/me`, { id_music, favorite: true });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái yêu thích:', error);
        }
    };


    useEffect(() => {
        if (audioRef.current && currentSong) {
            audioRef.current.src = currentSong.url_path;
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [currentSong]);

    const handlePlayPause = (album: Mussic) => {
        if (currentSong?.id_music === album.id_music && isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            setCurrentSong(album);
            setIsPlaying(true);
        }
    };

    const handleFilterClick = (filter: string) => setActiveFilter(filter);

    const filteredAlbums = activeFilter === 'Tất cả'
        ? albums
        : albums.filter(album => album.genre === activeFilter);

        const toggleMenu = (id: number) => {
            setMenuVisible((prev) => (prev === id ? null : id));
        };
        const handleAddToPlaylist = (album: Mussic, playlistId: number) => {
            console.log(`Thêm album ${album.name} vào playlist ${playlistId}`);
        };

    return (
        <>
            <div className={style.headerSection}>
                <h2>Mới phát hành</h2>
                <div className={style.all}>
                    <a href="#" className={style.viewAllButton}>Tất cả</a>
                    <ReactSVG className={style.csvg} src="/all.svg" />
                </div>
            </div>

            <div className={style.filterBar}>
                {['Tất cả', 'Việt Nam', 'Quốc tế'].map((filter) => (
                    <button
                        key={filter}
                        className={`${style.filter} ${activeFilter === filter ? style.active : ''}`}
                        onClick={() => handleFilterClick(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className={style.albumList}>
                {filteredAlbums.map((album) => {
                    return (
                        (
                    
                            <div
                                key={album.id_music}
                                className={style.songCard}
                                onMouseEnter={() => setHoveredSong(album.id_music)}
                                onMouseLeave={() => setHoveredSong(null)}
                            >
                                <div className={style.albumCoverWrapper}>
                                    <img src={album.url_cover} alt={album.name} className={style.albumCover} />
                                    <div className={style.overlay}>
                                        <button
                                            className={style.playButton}
                                            onClick={() => handlePlayPause(album)}
                                        >
                                            {album.id_music === currentSong?.id_music && isPlaying ? (
                                                <i className="fas fa-pause"></i>
                                            ) : hoveredSong === album.id_music ? (
                                                <i className="fas fa-play"></i>
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
                                <div className={style.songControls}>
                                    <i 
                                        className={`fas fa-heart ${favoriteMusic.has(album.id_music) ? style.activeHeart : ''}`}
                                        onClick={() => toggleFavorite(album.id_music)}
                                ></i>
                                    <i className="fas fa-ellipsis-h"
                                    onClick={() => toggleMenu(album.id_music)} 
                                    ></i>
                                </div>
                                {menuVisible === album.id_music && (
                            <div className={style.menu}>
                                <button onClick={() => console.log('Thêm vào playlist')}>Thêm vào playlist</button>
                                <button onClick={() => console.log('Chia sẻ')}>Chia sẻ</button>
                                <button onClick={() => console.log('Tải về')}>Tải về</button>
                            </div>
                                )}
                                <div className={style.viewCount}>
                                    Lượt xem: {viewCounts[album.id_music] || 0}
                                    </div>
                            </div>
                        )
                    )
                }
                )}

                      
            </div>

            <audio ref={audioRef}></audio>
        </>
    );
};

export default ListMusic;
