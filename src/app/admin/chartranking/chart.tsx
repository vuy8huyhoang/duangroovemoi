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
  revenue: number;
}
interface RankingData {
  view: number;
  favorite: number;
  id_music: string;
  name: string;
  slug: string;
}

export default function ChartRanking() {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/payment/chart")
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

  // const generateLast30Days = () => {
  //   const days = [];
  //   const now = new Date();
  //   for (let i = 29; i >= 0; i++) {
  //     const date = new Date();
  //     date.setDate(now.getDate() - i);
  //     days.push(`${date.getDate()}/${date.getMonth() + 1}`);
  //   }
  //   return days;
  // };

  // const formattedLabels = generateLast30Days();

  const data = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Doanh thu",
        data: charts.map((item) => item.revenue),
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
        text: "Biểu đồ doanh thu trong 30 ngày",
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
            return `Doanh thu: ${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(context.raw)}`;
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
          text: "Doanh thu",
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
