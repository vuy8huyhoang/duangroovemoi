"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import style from './type.module.scss';
import ListMusicTop from '../listmusictop';
import ListMusicType from '../listmusicType';
import ListAlbum from '../listalbum';
import MusicPartner from '../musicpartner';
interface Type {
  id_type: string;
  name: string;
}

const TypePage = () => {
  const [typeList, setTypeList] = useState<Type[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false); 

  const fetchTypeList = async () => {
    try {
      const response = await axios.get('https://api-groove.vercel.app/type');
      console.log(response.data);
      setTypeList(response.data.data || []); 
    } catch (err) {
      console.error("Error fetching type list:", err);
      setError("Có lỗi xảy ra khi tải danh sách thể loại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypeList();
  }, []); 

  const handleShowAll = () => {
    setShowAll(true); 
  };

  if (loading) {
    return <div className={style.loading}>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className={style.error}>{error}</div>;
  }

  return (
    <>

      <div className={style.container}>
        <h1 className={style.title}>Danh Sách Thể Loại</h1>
        <ul className={style.typeList}>
          {Array.isArray(typeList) && typeList.length > 0 ? (
            typeList.slice(0, showAll ? typeList.length : 4).map((type) => (
              <li key={type.id_type} className={style.typeItem}>
                <Link href={`/type/${type.id_type}`} className={style.typeLink}>
                  {type.name}
                </Link>
              </li>
            ))
          ) : (
            <li className={style.typeItem}>Không có thể loại nào.</li>
          )}
        </ul>
        {!showAll && (
          <button onClick={handleShowAll} className={style.showAllButton}>
            Tất cả
          </button>
        )}
      <ListMusicType />
      <ListMusicTop />
      <ListAlbum />
      <MusicPartner/>
      </div>

    </>
  );
};

export default TypePage;
