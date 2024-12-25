"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import style from "./sc.module.scss";
const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        placeholder="Tìm kiếm bài hát, album, nghệ sĩ, nhạc sĩ"
        className={style.timkiem}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className="absolute top-[50%] left-[10px]"
        style={{ transform: "translateY(-50%)" }}
      >
        <path
          d="M14.6299 14.2002L17.4297 17M5.23077 2.01733C6.8275 1.09591 8.70473 0.786331 10.5128 1.14627C12.3208 1.50621 13.9364 2.51113 15.0585 3.97381C16.1806 5.43649 16.7327 7.2572 16.6121 9.09677C16.4914 10.9363 15.7061 12.6693 14.4026 13.9729C13.099 15.2764 11.366 16.0617 9.52645 16.1824C7.68689 16.303 5.86618 15.7509 4.4035 14.6288C2.94081 13.5067 1.9359 11.8911 1.57596 10.0831C1.21602 8.27505 1.52559 6.39781 2.44701 4.80108"
          stroke="#63646F"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Search;
