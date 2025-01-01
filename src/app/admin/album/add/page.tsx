"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import styles from "../../form.module.scss";

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
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    setAlbum({
      ...album,
      musics: musics.filter((music) => selectedMusics.includes(music.id_music)),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Kiểm tra xem tệp có phải là hình ảnh không
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(selectedFile.type)) {
        alert("Vui lòng tải lên một tệp hình ảnh hợp lệ (JPEG, PNG, GIF).");
        return;
      }

      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }
  };

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAlbum({ ...album, is_show: value });
  };

  const handleSubmit = async () => {
    // Kiểm tra lỗi các trường
    if (!album.name.trim()) {
      alert("Tên album không được để trống.");
      return;
    }
    if (!album.release_date) {
      alert("Ngày phát hành không được để trống.");
      return;
    }
    if (album.artists.length === 0) {
      alert("Vui lòng chọn ít nhất một nghệ sĩ.");
      return;
    }
    if (album.musics.length === 0) {
      alert("Vui lòng chọn ít nhất một bài hát.");
      return;
    }
    if (!file) {
      alert("Vui lòng tải lên ảnh bìa.");
      return;
    }

    setLoading(true);

    const slug = album.name.toLowerCase().replace(/\s+/g, "-");
    const albumData: any = { ...album, slug };

    try {
      // Tải lên ảnh bìa
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse: any = await axios.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadResponse?.result?.url) {
        albumData.url_cover = uploadResponse.result.url;
      } else {
        alert("Lỗi tải lên ảnh bìa.");
        return;
      }

      albumData.musics = albumData.musics.map((music: any) => ({
        id_music: music.id_music,
      }));
      albumData.id_artist = album.artists[0];
      delete albumData.artists;
      delete albumData.id_album;

      const response = await axios.post("/album", albumData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Album đã được thêm thành công!");
        window.location.href = "/admin/album";
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
          type="date"
          name="release_date"
          value={album.release_date || ""}
          onChange={handleChange}
        />
        <select onChange={handleArtistSelect}>
          <option value="">Chọn nghệ sĩ</option>
          {artists.map((artist) => (
            <option key={artist.id_artist} value={artist.id_artist}>
              {artist.name}
            </option>
          ))}
        </select>

        <h3>Chọn bài hát</h3>
        <select onChange={handleMusicSelect} multiple>
          {musics.map((music) => (
            <option key={music.id_music} value={music.id_music}>
              {music.name}
            </option>
          ))}
        </select>

        <div className={styles.visibilityRadioButtons}>
          <div className={styles.hien}>
            <label>Hiện</label>
            <input
              type="radio"
              name="is_show"
              value="1"
              checked={album.is_show === 1}
              onChange={handleVisibilityChange}
            />
          </div>
          <div className={styles.an}>
            <label>Ẩn</label>
            <input
              type="radio"
              name="is_show"
              value="0"
              checked={album.is_show === 0}
              onChange={handleVisibilityChange}
            />
          </div>
        </div>

        {previewUrl && (
          <div className={styles.preview}>
            <img src={previewUrl} alt="Xem trước ảnh bìa" />
          </div>
        )}

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang gửi..." : "Thêm album"}
        </button>
      </div>
    </div>
  );
}
