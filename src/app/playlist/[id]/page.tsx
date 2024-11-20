"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";
import style from "./playlistdetail.module.scss";

interface Playlist {
  id_playlist: string;
  name: string;
  url_cover: string;
  musics: Music[];
}

interface Music {
  id_music: string;
  name: string;
  composer: string;
  url_path: string;
  url_cover: string;
  total_duration: string;
}

const PlaylistDetailPage: React.FC = ({ params }: any) => {
  const id = params.id;
  const [playlistDetail, setPlaylistDetail] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/playlist/me?id_playlist=${id}`)
      .then((response:any) => {
        setPlaylistDetail(response.result.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching playlist details", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>Đang tải chi tiết playlist...</p>;
  }

  if (!playlistDetail) {
    return <p>Không tìm thấy playlist</p>;
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
          <div className={style.imageContainer}>
            <img
              src={playlistDetail.url_cover}
              alt={playlistDetail.name}
              className={style.coverImage}
            />
          </div>
          <h2>{playlistDetail.name}</h2>
          <p>Số bài hát: {playlistDetail.musics.length}</p>
        </div>
        <div className={style.modalContentLeft}>
          {playlistDetail.musics.map((music) => (
            <div key={music.id_music} className={style.songContent}>
              <div className={style.imageContainer}>
                <img
                  src={music.url_cover}
                  alt={music.name}
                  className={style.coverImage}
                />
              </div>
              <p className={style.songTitle}>
                <strong>{music.name}</strong>
              </p>
              <p>Nhạc sĩ: {music.composer}</p>
              <p>Thời lượng: {music.total_duration}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
