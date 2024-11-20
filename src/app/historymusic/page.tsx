
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

interface AggregatedHistory {
  id_music: string;
  name: string;
  url_cover: string;
  total_play_duration: number; // Tổng thời gian phát
  view_count: number; // Tổng lượt xem
  last_played: string; // Lần nghe gần nhất
}

const HistoryMusicPage = () => {
  const [aggregatedHistory, setAggregatedHistory] = useState<AggregatedHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusicHistory = async () => {
      try {
        const response: any = await axios.get("/music-history/me");
        const historyData: MusicHistory[] = response.result.data;

        // Nhóm và tổng hợp lịch sử nghe nhạc theo id_music
        const aggregated: { [key: string]: AggregatedHistory } = {};
        historyData.forEach((history) => {
          const id = history.id_music;
          if (!aggregated[id]) {
            aggregated[id] = {
              id_music: history.music.id_music,
              name: history.music.name,
              url_cover: history.music.url_cover || "/default-cover.png",
              total_play_duration: 0,
              view_count: 0,
              last_played: history.created_at,
            };
          }
          aggregated[id].total_play_duration += history.play_duration;
          aggregated[id].view_count += 1;
          if (new Date(history.created_at) > new Date(aggregated[id].last_played)) {
            aggregated[id].last_played = history.created_at;
          }
        });

        // Chuyển đổi object thành mảng và sắp xếp theo thời gian nghe gần nhất
        const aggregatedArray = Object.values(aggregated).sort(
          (a, b) => new Date(b.last_played).getTime() - new Date(a.last_played).getTime()
        );
        setAggregatedHistory(aggregatedArray);
      } catch (error) {
        console.error("Không thể lấy dữ liệu lịch sử nghe nhạc", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMusicHistory();
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className={style.historyPage}>
      <h1 className={style.title}>Lịch sử nghe nhạc</h1>
      <div className={style.musicGrid}>
        {aggregatedHistory.map((history) => (
          <div key={history.id_music} className={style.musicItem}>
            <img src={history.url_cover} alt={history.name} />
            <Link href={`/musicdetail/${history.id_music}`}>{history.name}</Link>
            <p>Tổng thời gian phát: {history.total_play_duration} giây</p>
            <p>Lần cuối nghe: {new Date(history.last_played).toLocaleString()}</p>
            <p>Lượt xem: {history.view_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryMusicPage;

