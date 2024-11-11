"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./historymusic.module.scss";
import Link from "next/link";

interface MusicHistory {
  id_music_history: string;
  id_music: string;
  play_duration: number;
  created_at: string;
  music: {
    id_music: string;
    name: string;
    url_cover: string;
  };
}

const HistoryMusicPage = () => {
  const [musicHistory, setMusicHistory] = useState<MusicHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCounts, setViewCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchMusicHistory = async () => {
      try {

        const response: any = await axios.get("/music-history/me"); 
        console.log('Music History Data:', response.result); 
        const historyData: MusicHistory[] = response.result.data;
        setMusicHistory(historyData);

        const counts: { [key: string]: number } = {};
        historyData.forEach((history) => {
          counts[history.id_music] = (counts[history.id_music] || 0) + 1;
        });
        setViewCounts(counts);


      } catch (error) {
        console.error("Failed to fetch music history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMusicHistory();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={style.historyPage}>
      <h1 className={style.title}>Lịch sử nghe nhạc</h1>
      <div className={style.musicGrid}>
        {musicHistory.map((history) => (
          <div key={history.id_music_history} className={style.musicItem}>
            <img
              src={history.music.url_cover || "/default-cover.png"}
              alt={history.music.name}
            />
            <Link href={`/musicdetail/${history.music.id_music}`}>
              {history.music.name}
            </Link>

            <p >Thời gian phát: {history.play_duration} giây</p>
            <p>Đã nghe vào: {new Date(history.created_at).toLocaleString()}</p>
            <p>Lượt xem: {viewCounts[history.id_music] || 0}</p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryMusicPage;
