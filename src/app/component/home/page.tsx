"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import ListMusic from "./listmusic";
import ListAlbum from "./listalbum";
import ListMusicTop from "./listmusictop";
import ListType from "./listtype";
import MusicType from "./albumhot";
import MusicPartner from "./musicpartner";
import MusicModel from "@/models/MusicModel";
import AlbumModel from "@/models/AlbumModel";
import Link from "next/link";
import clsx from "clsx";

export default function Home() {
  const [albumData, setAlbumData] = useState<AlbumModel[]>([]);
  const [musicData, setMusicData] = useState<MusicModel[]>([]);
  const [typeData, setTypeData] = useState<any>([]);
  const [randomList, setRandomList] = useState([]);
  const [range, setRange] = useState({ 0: [0, 4], 1: [0, 6] });

  function generateRandomArray(start, end, count) {
    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // Nếu số lượng yêu cầu lớn hơn số phần tử trong khoảng, trả về toàn bộ range
    if (count >= range.length) {
      return range.sort(() => Math.random() - 0.5); // Trả về toàn bộ nhưng ngẫu nhiên thứ tự
    }

    const result = [];
    while (result.length < count) {
      const randomIndex = Math.floor(Math.random() * range.length);
      result.push(range[randomIndex]);
      range.splice(randomIndex, 1); // Loại bỏ số đã chọn để tránh trùng lặp
    }

    return result;
  }

  useEffect(() => {
    // Get album
    axios
      .get("/album")
      .then((response: any) => {
        // console.log("Full API response:", response);
        if (response && response.result && response.result.data) {
          setAlbumData(response.result.data);
        } else {
          console.error("Response result.data is undefined or null:", response);
          setAlbumData([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch album:", error);
        setAlbumData([]);
      });

    // Get music
    axios
      .get("/music")
      .then((response: any) => {
        // console.log("Full API response:", response);
        if (response && response.result && response.result.data) {
          setMusicData(response.result.data);
        } else {
          console.error("Response result.data is undefined or null:", response);
          setMusicData([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch album:", error);
        setMusicData([]);
      });

    axios
      .get("/type")
      .then((response: any) => {
        // console.log("Full API response:", response);
        if (response && response.result && response.result.data) {
          setTypeData(response.result.data);
          setRandomList(
            generateRandomArray(0, response.result.data.length - 1, 3)
          );
        } else {
          console.error("Response result.data is undefined or null:", response);
          setTypeData([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch album:", error);
        setTypeData([]);
      });
  }, []);

  return (
    <>
      {/* Album random */}
      <div className="flex flex-row mx-auto px-[40px] mb-[50px]">
        <div className="grid grid-cols-12 gap-4 w-full relative">
          {[...albumData]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .map((album) => (
              <Link
                key={album.id_album}
                href={`/albumdetail/${album.id_album}`}
                className="col-span-3 h-0 pb-[56.25%] relative overflow-hidden rounded-lg bg-gray-200 group"
              >
                {/* Ảnh album */}
                <img
                  src={album.url_cover}
                  alt={album.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay hiển thị tên album và ca sĩ */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-center items-center">
                  <span className="text-white text-lg font-semibold px-4 text-center">
                    {album.name}
                  </span>
                  <span className="text-gray-300 text-sm">
                    {album.artist.name}
                  </span>
                </div>
              </Link>
            ))}
          {/* <div
            onClick={() => {
              setRange((prev: any) => {
                // Kiểm tra số lượng phần tử trong albumData
                const maxIndex = albumData.length;

                // Tính toán giá trị mới
                const newStart = prev[0][0] + 4;
                const newEnd = prev[0][1] + 4;

                // Nếu vượt quá maxIndex, gán giá trị trong khoảng gần nhất
                if (newEnd > maxIndex) {
                  return {
                    ...prev,
                    0: [maxIndex - 3, maxIndex], // Gán giá trị từ maxIndex - 3 đến maxIndex
                  };
                }

                // Nếu không vượt quá, cập nhật bình thường
                return {
                  ...prev,
                  0: [newStart, newEnd],
                };
              });
            }}
            className={clsx(
              "absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer rounded-full overflow-hidden transform hover:scale-125 bg-gray-300 transition duration-300",
              { ["disable"]: range[0][0] <= 0 }
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </div> */}
          {/* <div className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer rounded-full overflow-hidden transform hover:scale-110 bg-gray-300 transition duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div> */}
        </div>
      </div>

      <ListMusic />
      {/* <ListMusicTop /> */}
      <ListAlbum />
      <ListType />
      {randomList.map((number) => {
        // console.log(number);

        return (
          musicData
            .filter((music) =>
              music.types.some(
                (t) =>
                  t.type.name.toLowerCase() ===
                  typeData[number].name.toLowerCase()
              )
            )
            .slice(0, 6).length > 0 && (
            <MusicType
              key={number}
              type={typeData[number].name}
              id_type={typeData[number].id_type}
              musicList={musicData
                .filter((music) =>
                  music.types.some(
                    (t) =>
                      t.type.name.toLowerCase() ===
                      typeData[number].name.toLowerCase()
                  )
                )
                .slice(0, 6)}
            />
          )
        );
      })}
      <MusicPartner />
    </>
  );
}
