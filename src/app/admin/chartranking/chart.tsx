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
import clsx from "clsx";

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
    return (
      <p className={clsx(styles.loading, "pl-4 pb-4")}>
        Đang tải dữ liệu bảng xếp hạng...
      </p>
    );

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
      {/* <div className={styles.dropdownContainer}>
        <label
          htmlFor="top-limit"
          className="text-sm font-medium text-gray-700"
        >
          Chọn số lượng bài hát:
        </label>
        <select
          id="top-limit"
          value={topLimit}
          onChange={handleTopLimitChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 sm:text-sm"
          aria-label="Chọn số lượng bài hát"
        >
          {[...Array(6)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              Top {index + 1}
            </option>
          ))}
        </select>
      </div> */}

      <div className="flex space-x-2">
        {["day", "week", "month"].map((frame) => (
          <button
            key={frame}
            className={clsx(
              "border border-gray-200 px-4 py-2 rounded-full text-sm font-normal transition-all focus:outline-none",
              {
                "text-gray-500 bg-white hover:bg-gray-100 focus:ring-2 focus:ring-blue-300":
                  timeFrame !== frame,
                "bg-blue-500 text-white": timeFrame === frame,
              }
            )}
            onClick={() => setTimeFrame(frame)}
            aria-pressed={timeFrame === frame}
            aria-label={`Thống kê bài hát theo ${
              frame === "day" ? "Ngày" : frame === "week" ? "Tuần" : "Tháng"
            }`}
          >
            {frame === "day" ? "Ngày" : frame === "week" ? "Tuần" : "Tháng"}
          </button>
        ))}
      </div>

      {/* <h3 className="mt-6 text-lg font-semibold text-gray-800">
        Thống kê Top {topLimit} Bài Hát{" "}
        {timeFrame === "month"
          ? "Trong Tháng"
          : timeFrame === "week"
          ? "Trong Tuần"
          : "Trong Ngày"}
      </h3> */}

      <div className="mt-4">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
