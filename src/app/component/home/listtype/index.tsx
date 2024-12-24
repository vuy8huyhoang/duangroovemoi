import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./listtype.module.scss";
import Link from "next/link";
import clsx from "clsx";
import { Img } from "react-image";
interface Type {
  id_type: string;
  name: string;
  slug: string;
}

export default function ListType() {
  const [albumData, setAlbumData] = useState<Type[]>([]);
  const [artistData, setArtistData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/type")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          const data = response.result.data;
          const ngaunhien = data.sort(() => 0.5 - Math.random());
          setAlbumData(ngaunhien.slice(0, 6));
        } else {
          console.error("Response data is undefined or null:", response);
          setAlbumData([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch album:", error);
        setAlbumData([]);
      })
      .finally(() => {
        setLoading(false);
      });

    axios
      .get("/artist")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          const data = response.result.data;
          const ngaunhien = data.sort(() => 0.5 - Math.random());
          setArtistData(ngaunhien.slice(0, 6));
        } else {
          console.error("Response data is undefined or null:", response);
          setArtistData([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch album:", error);
        setArtistData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      {/* <h2 className="home__heading px-[40px]">Thể loại nhạc </h2> */}
      <div>
        <Link href="/type" className="home__heading block px-[40px]">
          Âm nhạc theo thể loại
        </Link>
        <div className={style.albumGrid}>
          {loading ? (
            <p>Đang tải album...</p>
          ) : (
            albumData.map((album, index) => (
              <div key={album.id_type || index} className={style.albumCard}>
                <Link
                  href={`/type/${album.id_type}`}
                  className={style.typeLink}
                >
                  {album.name}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
      <div>
        <h2 className="home__heading block px-[40px]">Ca sĩ</h2>
        <div className="grid grid-cols-12 gap-4 px-[40px]">
          {loading ? (
            <p className="col-span-12 text-center">Đang tải album...</p>
          ) : (
            artistData.map((artist, index) => (
              <div
                key={artist.id_artist || index}
                className="col-span-2 flex flex-col items-center"
              >
                <Link
                  href={`/artistdetail/${artist.id_artist}`}
                  className="flex flex-col items-center no-underline hover:underline"
                >
                  <Img
                    src={artist.url_cover}
                    alt={artist.name}
                    className="w-40 h-40 object-cover rounded-full mb-2 border-2 border-gray-300"
                    unloader={
                      <img
                        src="/default.png"
                        alt="default"
                        className="w-24 h-24 object-cover rounded-full mb-2 border-2 border-gray-300"
                      />
                    }
                  />
                  <span className="text-sm font-medium text-gray-400 text-center">
                    {artist.name}
                  </span>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
