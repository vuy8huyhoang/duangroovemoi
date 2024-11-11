'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import style from './sc.module.scss';
const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && query) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleSearch}
      onKeyDown={handleKeyDown}
      placeholder="Tìm kiếm bài hát, album, nghệ sĩ..."
      className={style.timkiem}
    />
  );
};

export default Search;
