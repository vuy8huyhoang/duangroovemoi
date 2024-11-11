"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";
import style from "./songdetail.module.scss";
import AlbumHot from "@/app/component/albumhot";
import MusicPartner from "@/app/component/musicpartner";
import Comment from "@/app/component/comment";
import clsx from "clsx";
interface Music {
  id_music: number;
  name: string;
  url_cover: string;
  url_path: string;
  types: { name: string }[];
  producer: string;
  release_date: string;
  composer: string;
  total_duration: string | null;
  artists: Artist[];
}
interface Artist {
  id_artist: string;
  name: string;
  slug: string;
  url_cover: string;
}

const SongDetailPage: React.FC = ({ params }: any) => {
  const id = params.id;
  const [musicdetail, setMusic] = useState<Music | null>(null);
  const [artistdetail, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Music | null>(null);
  const [hoveredSong, setHoveredSong] = useState<number | null>(null);
  const [time, setTime] = useState([]);
  const [heart, setHeart] = useState(false);
  function formatDate(isoString: string) {
    const date = new Date(isoString);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    axios
      .get(`/music/${id}`)
      .then((response: any) => {
        if (response && response.result.data) {
          const musicData: Music = response.result.data;
          setMusic(musicData);
          setArtist(musicData.artists[0] || null);
        } else {
          console.error("Response data is undefined or null", response);
        }
        response.result.data.musics.map((musicData) => {
          const audio = new Audio(musicData.url_path);
          audio.onloadedmetadata = () => {
            console.log(`Thời lượng: ${audio.duration} giây`);
            setTime((prev) => {
              return [...prev, audio.duration];
            });
          };
        });
      })

      .catch((error: any) => {
        console.error("Error fetching album details", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  function formatTime(seconds) {
    seconds = Math.ceil(seconds);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }
  const handleHeartClick = (id_music) => {
    if (heart == true) {
      axios
        .delete(`favorite-music/me?id_music=${id_music}`)
        .then((response: any) => {
          console.log("Album unliked successfully", response);
          setHeart(false);
        })
        .catch((error: any) => {
          console.error("Error unliking album", error);
        });
    } else {
      axios
        .post(`favorite-music/me`, { id_music })
        .then((response: any) => {
          console.log("Album liked successfully", response);
          setHeart(true);
        })
        .catch((error: any) => {
          console.error("Error liking album", error);
        });
    }
  };

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

  if (loading) {
    return <p>Đang tải chi tiết bài hát...</p>;
  }

  if (!musicdetail && artistdetail) {
    return <p>Không tìm thấy music</p>;
  }

  return (
    <div className={style.contentwrapper}>
      <div className={style.banner}>
        <img
          src="https://adtima-media.zascdn.me/2024/05/28/1e75f3b2-dd19-46c6-ae1a-84611017eaf9.jpg"
          alt=""
          className={style.bannerImage}
        />
      </div>
      <div className={style.modalContent}>
        <div className={style.modalContentRight}>
          <img
            src={musicdetail.url_cover}
            alt={musicdetail.name}
            className={style.coverImage}
          />
          <h2>{musicdetail.name}</h2>
          <p className={style.songDuration}>Ca sĩ: {musicdetail.composer}</p>
          <div className={style.audioPlayer}>
            <button onClick={handlePlayPause} className={style.playButton}>
              {isPlaying ? "Dừng Bài Hát" : "Phát Bài Hát"}
            </button>
            <span
              className={clsx(style.heartIcon, {
                [style.heartIcon_active]: heart,
              })}
              onClick={() => handleHeartClick(musicdetail.id_music)}
            >
              ♥
            </span>
            <audio ref={audioRef} src={musicdetail.url_path} />
          </div>
        </div>

        <div className={style.modalContentLeft}>
          <p>Bài Hát</p>
          <div
            key={musicdetail.id_music}
            className={`${style.songCard} ${
              hoveredSong === musicdetail.id_music ? style.hovered : ""
            }`}
            onMouseEnter={() => setHoveredSong(musicdetail.id_music)}
            onMouseLeave={() => setHoveredSong(null)}
          >
            <div className={style.image}>
              <img
                src={musicdetail.url_cover}
                alt={musicdetail.name}
                className={style.musicCover}
              />
              <div className={style.overlay}>
                <button
                  className={style.playButton1}
                  onClick={() => playSong(musicdetail)}
                >
                  <i
                    className={`fas ${
                      currentSong?.id_music === musicdetail.id_music &&
                      isPlaying
                        ? "fa-pause"
                        : "fa-play"
                    }`}
                  ></i>
                </button>
              </div>
            </div>
            <div className={style.Titles}>
              <h5 className={style.musicName}>{musicdetail.name}</h5>
              <p className={style.musicArtist}>{musicdetail.composer}</p>
            </div>
            <span className={style.songDuration}>
              {musicdetail.total_duration &&
              time[Number(musicdetail.total_duration)]
                ? formatTime(time[Number(musicdetail.total_duration)])
                : "Chưa có thời lượng"}
            </span>
          </div>
          <h2>Thông Tin</h2>
          <p className={style.songTitle}>
            Nhà sản xuất: {musicdetail.producer}
          </p>
          <p className={style.songArtist}>
            Ngày phát hành: {formatDate(musicdetail.release_date)}
          </p>
        </div>
      </div>
      <Comment id_music={id} />
      <AlbumHot />
      <MusicPartner />
    </div>
  );
};

export default SongDetailPage;
