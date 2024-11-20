"use client";
import { useEffect, useState, useRef } from 'react';
import axios from '@/lib/axios';
import style from './playlistDetail.module.scss';

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

  useEffect(() => {
    // Gọi API để lấy chi tiết playlist và các bài hát
    axios.get(`/playlist/me/${id}`)
      .then((response:any) => {
        if (response && response.result) {
          setPlaylistDetail(response.result);
          console.log("test", response);
          
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

  if (!playlistDetail) {
    return <p>Đang tải danh sách bài hát...</p>;
  }

  return (
    <div className={style.contentWrapper}>
      <h1>{playlistDetail.name}</h1>
      <div className={style.songList}>
        {playlistDetail.musics.length > 0 ? (
          playlistDetail.musics.map((track, index) => (
            <div key={track.id_music} className={style.songItem}>
              <img src={track.url_cover} alt={track.name} className={style.songCover} />
              <div className={style.songInfo}>
                <span>{track.name}</span>
                <span>{track.producer}</span>
                <span>{track.total_duration}</span>
              </div>
              <button onClick={() => playSong(track)}>
                {currentSong?.id_music === track.id_music && isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          ))
        ) : (
          <p>Không có bài hát trong playlist này.</p>
        )}
      </div>
      <audio ref={audioRef} />
    </div>
  );
}
