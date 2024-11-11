"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import styles from "./addAlbum.module.scss";

interface Artist {
  id_artist: string;
  name: string;
  slug: string;
  url_cover: string;
}

interface Music {
  id_music: string;
  name: string;
  url_path: string;
  url_cover: string;
  producer: string;
  composer: string;
}

interface Album {
  id_album: string;
  name: string;
  slug: string;
  url_cover: string;
  release_date: string | null;
  created_at: string;
  last_update: string;
  is_show: number;
  artists: string[];
  musics: Music[];
}

export default function AddAlbum() {
  const [album, setAlbum] = useState<Album>({
    id_album: "",
    name: "",
    slug: "",
    url_cover: "",
    release_date: null,
    created_at: new Date().toISOString(),
    last_update: new Date().toISOString(),
    is_show: 1,
    artists: [],
    musics: [],
  });

  const [musics, setMusics] = useState<Music[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get("/artist")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          setArtists(response.result.data);
        } else {
          setArtists([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch nghệ sĩ:", error);
        setArtists([]);
      });

    axios
      .get("/music")
      .then((response: any) => {
        if (response && response.result && response.result.data) {
          setMusics(response.result.data);
        } else {
          setMusics([]);
        }
      })
      .catch((error: any) => {
        console.error("Lỗi fetch bài hát:", error);
        setMusics([]);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setAlbum({ ...album, [name]: value });
  };

  const handleArtistSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedArtists = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setAlbum({ ...album, artists: selectedArtists });
  };

  const handleMusicSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMusics = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    console.log(selectedMusics);
    console.log({
      ...album,
      musics: musics.filter((music) => selectedMusics.includes(music.id_music)),
    });
    setAlbum({
      ...album,
      musics: musics.filter((music) => selectedMusics.includes(music.id_music)),
    });
  };

  const handleSubmit = async () => {
    if (album.musics.length === 0) {
      alert("Vui lòng thêm ít nhất một bài hát trước khi thêm album.");
      return;
    }

    setLoading(true);
    const slug = album.name.toLowerCase().replace(/\s+/g, "-");
    const albumData: any = { ...album, slug };

    try {
      console.log(albumData);
      albumData.musics = albumData.musics.map((music: any) => {
        return { id_music: music.id_music };
      });
      albumData.id_artist = album.artists[0];
      delete albumData.artists;
      delete albumData.id_album;
      if (!albumData.url_cover) {
        albumData.url_cover = null;
      }
      const response = await axios.post("/album", albumData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Album đã được thêm thành công!");
        window.location.href = "/admin/adminalbum";
      } else {
        alert("Thêm album không thành công.");
      }
    } catch (error) {
      console.error("Error submitting album data:", error);
      alert("Đã xảy ra lỗi khi gửi dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Thêm mới album</h2>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="name"
          placeholder="Tên album"
          value={album.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="url_cover"
          placeholder="URL ảnh bìa"
          value={album.url_cover}
          onChange={handleChange}
        />
        <input
          type="date"
          name="release_date"
          value={album.release_date || ""}
          onChange={handleChange}
        />
        <select onChange={handleArtistSelect}>
          <option value="">Chọn nghệ sĩ</option>
          {artists && artists.length > 0 ? (
            artists.map((artist) => (
              <option key={artist.id_artist} value={artist.id_artist}>
                {artist.name}
              </option>
            ))
          ) : (
            <option>Đang tải nghệ sĩ...</option>
          )}
        </select>

        <h3>Chọn bài hát</h3>
        <select onChange={handleMusicSelect} multiple>
          <option value="">Chọn bài hát</option>

          {musics && musics.length > 0 ? (
            musics.map((music) => (
              <option
                className={
                  album.musics
                    .map((music) => music.id_music)
                    .includes(music.id_music)
                    ? "selected"
                    : ""
                }
                key={music.id_music}
                value={music.id_music}
              >
                {music.name}
              </option>
            ))
          ) : (
            <option>Đang tải bài hát...</option>
          )}
        </select>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang gửi..." : "Thêm album"}
        </button>
      </div>
    </div>
  );
}
