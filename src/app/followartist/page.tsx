"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./followartist.module.scss";
import Link from "next/link";
import { Img } from "react-image";
interface Artist {
  id_artist: string;
  name: string;
  url_cover: string;
  created_at: string;
  last_update: string;
  is_show: string;
  followers: string;
}

export default function Profile() {
  const [artistData, setArtistData] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("artist")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          setArtistData(response.result.data);
        } else {
          console.error("Response data is undefined or null", response);
        }
      })
      .catch((error: any) => {
        console.error("Error fetching artist data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={style.contentwrapper}>
        <h2>Đang tải dữ liệu...</h2>
      </div>
    );
  }

  return (
    <div className={style.contentwrapper}>
      <h2>Danh sách các nghệ sĩ</h2>
      <div className={style.artistList}>
        {artistData.length > 0 ? (
          artistData.map((artist) => (
            <div key={artist.id_artist} className={style.artistCard}>
              <Img
                src={artist.url_cover} // URL ảnh từ album
                alt={artist.name}
                className={style.artistCover}
                // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                unloader={
                  <img
                    src="/default.png"
                    alt="default"
                    className={style.artistCover}
                  />
                } // Thay thế ảnh khi lỗi
              />
              <h3>{artist.name}</h3>
              <div className={style.artistname}>
                <Link href={`/artistdetail/${artist.id_artist}`}>
                  {artist.name}
                </Link>
              </div>
              {/* <p>Followers: {artist.followers}</p>
                             <div className={style.songName}><Link href={`/musicdetail/${album.id_music}`}>{album.name}</Link></div>
                            <p>Created at: {new Date(artist.created_at).toLocaleDateString()}</p>
                            <p>Last updated: {new Date(artist.last_update).toLocaleDateString()}</p> */}
              {/* <Link to={`/artist/${artist.id_artist}`} className={style.detailLink}>Xem chi tiết</Link> */}
            </div>
          ))
        ) : (
          <p>Không có nghệ sĩ nào.</p>
        )}
      </div>
    </div>
  );
}
