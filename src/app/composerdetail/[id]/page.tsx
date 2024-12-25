"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "../composer.module.scss";
import { Img } from "react-image";

interface Composer {
  id_composer: string;
  name: string;
  url_cover: string;
}

interface Music {
  id_music: string;
  name: string;
  url_cover: string;
  url_path: string;
  composer: string;
}

export default function ComposerDetail({ params }) {
  const { id } = params; // Lấy id từ params
  const [composer, setComposer] = useState<Composer | null>(null);
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin nhạc sĩ
    axios
      .get(`/composer/${id}`)
      .then((response: any) => {
        if (response && response.result.data) {
          setComposer(response.result.data);
        } else {
          console.error("Không tìm thấy nhạc sĩ");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin nhạc sĩ", error);
      });

    // Lấy danh sách bài hát của nhạc sĩ
    axios
      .get(`/music?id_composer=${id}`)
      .then((response: any) => {
        if (response && response.result.data) {
          setMusicList(response.result.data);
        } else {
          console.error("Không tìm thấy bài hát nào cho nhạc sĩ này");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách bài hát", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (!composer) {
    return <p>Không tìm thấy nhạc sĩ.</p>;
  }

  return (
    <div className={style.container}>
      <h1>{composer.name}</h1>
      {composer.url_cover && (
        <Img
          src={composer.url_cover} // URL ảnh từ album
          alt={composer.name}
          // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
          unloader={<img src="/default.png" alt="default" />} // Thay thế ảnh khi lỗi
        />
      )}
      <h2>Bài hát của {composer.name}</h2>
      <ul>
        {musicList.length > 0 ? (
          musicList.map((music) => (
            <li key={music.id_music}>
              {music.url_cover && (
                <Img
                  src={music.url_cover} // URL ảnh từ album
                  alt={music.name}
                  // loader={<img src="path/to/loader.gif" alt="loading" />} // Thêm ảnh loading nếu muốn
                  unloader={<img src="/default.png" alt="default" />} // Thay thế ảnh khi lỗi
                />
              )}
              <p>{music.name}</p>
            </li>
          ))
        ) : (
          <p>Không có bài hát nào cho nhạc sĩ này.</p>
        )}
      </ul>
    </div>
  );
}
