"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "../../../form.module.scss";

interface Artist {
  id_artist: string;
  name: string;
  slug: string;
  url_cover: string;
}

interface Song {
  id_music: string;
  name: string;
  url_path: string;
  producer: string;
}

interface Music {
  id_music: string;
  name: string;
  url_path: string;
  url_cover: string;
  producer: string;
  composer: { id_composer: string; name: string };
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
  types: { id_type: string; name: string }[];
  musics: Song[];
}

export default function EditAlbum({ params }: { params: { id: string } }) {
  const [musics, setMusics] = useState<Music[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    axios.get("/music").then((response: any) => {
      if (response?.result?.data) {
        setMusics(response.result.data);
      }
    });
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
  }, []);
  useEffect(() => {
    if (params.id) {
      axios
        .get(`/album/${params.id}`)
        .then((response: any) => {
          if (response && response.result && response.result.data) {
            const albumData = response.result.data;
            setAlbum(albumData);
            setSelectedSongs(albumData.musics.map((song) => song.id_music));
          } else {
            setAlbum(null);
          }
        })
        .catch((error: any) => {
          console.error("Lỗi fetch album:", error);
          setAlbum(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) return <p>Đang tải...</p>;
  if (!album) return <p>Không tìm thấy album.</p>;
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setAlbum((prevAlbum) =>
      prevAlbum ? { ...prevAlbum, [name]: value } : prevAlbum
    );
  };

  const handleReleaseDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAlbum((prevAlbum) =>
      prevAlbum ? { ...prevAlbum, release_date: value } : prevAlbum
    );
  };

  const handleArtistSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedArtists = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setAlbum({ ...album, artists: selectedArtists });
  };

  const handleSongSelect = (songId: string) => {
    setSelectedSongs((prevSelected) => {
      if (prevSelected.includes(songId)) {
        return prevSelected.filter((id) => id !== songId);
      } else {
        return [...prevSelected, songId];
      }
    });
  };
  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (album) {
      setAlbum({
        ...album,
        is_show: parseInt(e.target.value, 10),
      });
    }
  };

  const handleSubmit = async () => {
    if (!album) {
      alert("Dữ liệu album không hợp lệ.");
      return;
    }

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

    if (selectedSongs.length === 0) {
      alert("Vui lòng chọn ít nhất một bài hát.");
      return;
    }

    if (!file && !album.url_cover) {
      alert("Vui lòng tải lên ảnh bìa.");
      return;
    }

    setLoading(true);

    const slug = album.name.toLowerCase().replace(/\s+/g, "-");
    const albumData: any = {
      ...album,
      slug,
      musics: selectedSongs.map((id) => ({ id_music: id })),
      last_update: new Date().toISOString(),
    };

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse: any = await axios.post(
          "/upload-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (uploadResponse?.result?.url) {
          albumData.url_cover = uploadResponse.result.url;
        } else {
          alert("Lỗi tải lên ảnh bìa.");
          return;
        }
      }

      const response = await axios.patch(`/album/${params.id}`, albumData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 204) {
        alert("Album đã được cập nhật thành công!");
        window.location.href = "/admin/album";
      } else {
        alert("Cập nhật album không thành công.");
      }
    } catch (error) {
      console.error("Error updating album data:", error);
      alert("Đã xảy ra lỗi khi cập nhật dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleMusicSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMusics = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedSongs(selectedMusics);
  };

  return (
    <>
      <div className={styles.container}>
        <h2>Chỉnh sửa album</h2>
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Tên album</label>
            <input
              type="text"
              name="name"
              placeholder="Tên album"
              value={album?.name || ""}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Ngày phát hành</label>
            <input
              type="date"
              name="release_date"
              value={album?.release_date?.split("T")[0] || ""}
              onChange={handleReleaseDateChange}
              className={styles.input}
            />
          </div>

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
          {previewUrl && (
            <div className={styles.preview}>
              <img src={previewUrl} alt="Xem trước ảnh bìa" />
            </div>
          )}
          <label htmlFor="file-upload" className={styles.customFileUpload}>
            Chọn ảnh bìa
          </label>
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
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
        <h3>Chọn bài hát</h3>
        <select onChange={handleMusicSelect} multiple>
          <option value="">Chọn bài hát</option>
          {musics && musics.length > 0 ? (
            musics.map((music) => (
              <option
                key={music.id_music}
                value={music.id_music}
                className={
                  album.musics
                    .map((song) => song.id_music)
                    .includes(music.id_music)
                    ? "selected"
                    : ""
                }
              >
                {music.name}
              </option>
            ))
          ) : (
            <option>Không có bài hát nào.</option>
          )}
        </select>

        <h3>Danh sách bài hát đã chọn</h3>
        {selectedSongs.length > 0 ? (
          selectedSongs.map((songId) => {
            const selectedSong = musics.find(
              (music) => music.id_music === songId
            );
            return selectedSong ? (
              <div key={songId} className={styles.songGroup}>
                <span>{selectedSong.name}</span>
                <button onClick={() => handleSongSelect(songId)}>
                  Bỏ chọn
                </button>
              </div>
            ) : null;
          })
        ) : (
          <p>Chưa chọn bài hát nào.</p>
        )}
        <div className={styles.submit}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật album"}
          </button>
        </div>
      </div>
    </>
  );
}
