"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Bar } from "react-chartjs-2";
import styles from "./chart.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RankingData {
  view: number;
  favorite: number;
  id_music: string;
  name: string;
  slug: string;
}

export default function RankingChart() {
  const [rankingData, setRankingData] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<string>("month");
  const [topLimit, setTopLimit] = useState<number>(5);
  useEffect(() => {
    axios
      .get(`/ranking?duration=${timeFrame}&limit=${topLimit}`)
      .then((response: any) => {
        // console.log("Dữ liệu của ranking", response);
        if (response?.result?.data) {
          const sortedData = response.result.data.sort(
            (a: RankingData, b: RankingData) => b.view - a.view
          );
          setRankingData(sortedData);
        } else {
          console.error("Dữ liệu phản hồi không xác định hoặc null", response);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi khi lấy dữ liệu ranking", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [timeFrame, topLimit]);

  if (loading)
    return <p className={styles.loading}>Đang tải dữ liệu bảng xếp hạng...</p>;

  const songLabels = rankingData.map((item) => item.name);
  const viewsData = rankingData.map((item) => item.view);

  const data = {
    labels: songLabels,
    datasets: [
      {
        label: "Lượt xem",
        data: viewsData,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(54, 162, 235, 0.8)",
        hoverBorderColor: "rgba(54, 162, 235, 1)",
        hoverBorderWidth: 3,
        borderRadius: 10,
        barPercentage: 0.8,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: true,
        font: {
          size: 18,
          weight: "bold",
          family: "Arial, sans-serif",
        },
        color: "#ddd",
        text: `Top ${topLimit} Bài Hát ${
          timeFrame === "month"
            ? "Trong Tháng"
            : timeFrame === "week"
            ? "Trong Tuần"
            : "Trong Ngày"
        }`, // Cập nhật tiêu đề
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        bodyFont: {
          color: "#ddd",
          size: 16,
          family: "Arial, sans-serif",
        },
        titleFont: {
          color: "#ddd",
          size: 16,
          weight: "bold",
        },
        padding: 10,
        boxPadding: 5,
        callbacks: {
          label: function (context) {
            return `Lượt xem: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tên bài hát",
          font: {
            color: "#ddd",

            size: 16,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          font: {
            color: "#ddd",
            size: 16,
          },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: "Lượt xem",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          borderColor: "#ddd",
          borderWidth: 1,
          lineWidth: 1,
        },
        ticks: {
          beginAtZero: true,
          stepSize: 5,
          font: {
            size: 20,
          },
        },
      },
    },
  };

  const handleTopLimitChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTopLimit(parseInt(event.target.value));
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.dropdownContainer}>
        <label htmlFor="top-limit" className={styles.label}>
          Chọn số lượng bài hát:{" "}
        </label>
        <select
          id="top-limit"
          value={topLimit}
          onChange={handleTopLimitChange}
          className={styles.select}
        >
          <option value={1}>Top 1</option>
          <option value={2}>Top 2</option>
          <option value={3}>Top 3</option>
          <option value={4}>Top 4</option>
          <option value={5}>Top 5</option>
          <option value={6}>Top 6</option>
        </select>
      </div>
      <div className={styles.timeFrameContainer}>
        <button onClick={() => setTimeFrame("day")}>Theo Ngày</button>
        <button onClick={() => setTimeFrame("week")}>Theo Tuần</button>
        <button onClick={() => setTimeFrame("month")}>Theo Tháng</button>
      </div>
      <h3 className={styles.title}>
        Thống kê Top {topLimit} Bài Hát{" "}
        {timeFrame === "month"
          ? "Trong Tháng"
          : timeFrame === "week"
          ? "Trong Tuần"
          : "Trong Ngày"}
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
}
