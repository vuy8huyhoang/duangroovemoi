"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import styles from "../chartranking/chart.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import clsx from "clsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  day: string;
  view: number;
}
interface RankingData {
  view: number;
  favorite: number;
  id_music: string;
  name: string;
  slug: string;
}

export default function Chart() {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState<any[]>([]);
  const songLabels = rankingData.map((item) => item.name);
  const viewsData = rankingData.map((item) => item.view);

  useEffect(() => {
    axios
      .get("/chart")
      .then((response: any) => {
        // console.log("dữ liệu của chart", response);

        if (response?.result?.data) {
          setCharts(response.result.data);
        } else {
          console.error("Dữ liệu phản hồi không xác định hoặc null", response);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi khi lấy dữ liệu chart", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    axios
      .get("/ranking?duration=month&limit=10")
      .then((response: any) => {
        // console.log("Dữ liệu của ranking", response);

        if (response?.result?.data) {
          setRankingData(response.result.data);
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
  }, []);

  if (loading)
    return (
      <p className={clsx(styles.loading, "px-4 pb-4")}>
        Đang tải dữ liệu biểu đồ...
      </p>
    );

  const formattedLabels = charts.map((item) => {
    const date = new Date(item.day);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  const data = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Lượt xem",
        data: charts.map((item) => item.view),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Biểu đồ lượt xem trong 30 ngày",
      },
      tooltip: {
        bodyFont: {
          size: 16,
        },
        titleFont: {
          size: 16,
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
          text: "Ngày",
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: "Lượt xem",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      {/* <h3 className={styles.title}>Thống kê lượt xem trong 30 ngày</h3> */}
      <Line data={data} options={options} />
    </div>
  );
}
