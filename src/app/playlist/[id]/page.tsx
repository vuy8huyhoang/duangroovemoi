"use client";
import { useEffect, useState, useRef } from 'react';
import axios from '@/lib/axios';
import style from './playlistdetail.module.scss';

interface Music {
  id_music: string;
  name: string;
  url_path: string;
  total_duration: string;
  producer: string;
  url_cover: string;
}

interface PlaylistDetail {
  id_playlist: string;
  name: string;
  musics: Music[];
}

export default function PlaylistDetail({ params }) {
  const { id } = params; // ID từ URL
  const [playlistDetail, setPlaylistDetail] = useState<PlaylistDetail | null>(null);
  const [currentSong, setCurrentSong] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  
  console.log("test:", id);
  
  useEffect(() => {
    // Gọi API để lấy chi tiết playlist và các bài hát
    axios.get(`/playlist/me?id_playlist=${id}`)
      .then((response:any) => {
        if (response && response.result) {
          setPlaylistDetail(response.result);
          console.log("playlist detail", response.result);
          
        } else {
          console.error('Dữ liệu không hợp lệ', response);
        }
      })
      .catch((error) => {
        console.error('Lỗi khi tải playlist', error);
      });
  }, [id]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url_path;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  const playSong = (music: Music) => {
    if (audioRef.current) {
      if (currentSong?.id_music === music.id_music && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setCurrentSong(music);
        audioRef.current.src = music.url_path;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const playlist = playlistDetail;
  const musics = playlist?.musics || [];

  if (!playlistDetail) {
    return <p>Đang tải danh sách bài hát...</p>;
  }

  return (
    <div className={style.playlistDetail}>
      {/* Hiển thị thông tin playlist */}
      {playlist? (
        <div className={style.playlistHeader}>
          <img
            src={musics[0]?.url_cover || ""}
            alt={playlist.name}
            className={style.playlistCover}
          />
          <div>
            <h1>{playlist.name}</h1>
            <p>{musics.length} bài hát</p>
          </div>
        </div>
      ) : (
        <p>Đang tải danh sách bài hát...</p>
      )}

      {/* Hiển thị danh sách bài hát */}
      <div className={style.songList}>
        {musics.length > 0 ? (
          musics.map((music) => (
            <div
              key={music.id_music}
              className={style.songItem}
              onClick={() => playSong(music)}
            >
              <img
                src={music.url_cover}
                alt={music.name}
                className={style.songCover}
              />
              <div className={style.songInfo}>
                <span className={style.songName}>{music.name}</span>
                <span className={style.albumName}>{music.producer}</span>
              </div>
              <div className={style.songDuration}>{music.total_duration}</div>
            </div>
          ))
        ) : (
          <p>Không có bài hát trong playlist này.</p>
        )}
      </div>

      {/* Audio player ẩn */}
      <audio ref={audioRef} />
    </div>

  );
}
