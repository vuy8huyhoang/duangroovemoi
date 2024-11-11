"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "../editAlbum.module.scss";

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

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

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

  const handleSubmit = async () => {
    setLoading(true);
    const slug = album?.name.toLowerCase().replace(/\s+/g, "-");
    const albumData = {
      name: album?.name,
      url_cover: album?.url_cover,
      release_date: album?.release_date ? album.release_date : undefined,
      last_update: new Date().toISOString(),
      musics: musics.filter((music) => selectedSongs.includes(music.id_music)),
      artists: album?.artists || [],
    };

    console.log("Data being sent:", albumData);

    try {
      const response = await axios.patch(`/album/${params.id}`, albumData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 204) {
        alert("Album đã được cập nhật thành công!");
        window.location.href = "/admin/adminalbum";
      } else {
        alert("Cập nhật album không thành công.");
      }
    } catch (error: any) {
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
          <input
            type="text"
            name="name"
            placeholder="Tên album"
            value={album?.name || ""}
            onChange={handleChange}
          />
          <input
            type="text"
            name="url_cover"
            placeholder="URL ảnh bìa"
            value={album?.url_cover || ""}
            onChange={handleChange}
          />
          <input
            type="date"
            name="release_date"
            value={album?.release_date?.split("T")[0] || ""}
            onChange={handleReleaseDateChange}
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
