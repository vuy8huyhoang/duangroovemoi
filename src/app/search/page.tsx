"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import styles from "./search.module.scss";
import Link from "next/link";
import MusicPartner from "../component/musicpartner";

const SearchResultsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [musicList, setMusicList] = useState<any[]>([]);
  const [albumList, setAlbumList] = useState<any[]>([]);
  const [artistList, setArtistList] = useState<any[]>([]);

  const [currentMusicPage, setCurrentMusicPage] = useState(1);
  const [currentArtistPage, setCurrentArtistPage] = useState(1);
  const [currentAlbumPage, setCurrentAlbumPage] = useState(1);
  const itemsPerPage = 9;
  const itemsPerPage0 = 12;
  const itemsPerPage1 = 5;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        try {
          const response = await axios.get(
            `https://api-groove.vercel.app/search?search_text=${encodeURIComponent(
              query
            )}`
          );
          const data = response.data.data;
          setMusicList(data.musicList || []);
          setAlbumList(data.albumList || []);
          setArtistList(data.artistList || []);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }
    };

    fetchSearchResults();
  }, [query]);

  const paginatedMusic = musicList.slice(
    (currentMusicPage - 1) * itemsPerPage,
    currentMusicPage * itemsPerPage
  );
  const totalMusicPages = Math.ceil(musicList.length / itemsPerPage);

  const paginatedArtists = artistList.slice(
    (currentArtistPage - 1) * itemsPerPage0,
    currentArtistPage * itemsPerPage0
  );
  const totalArtistPages = Math.ceil(artistList.length / itemsPerPage0);

  const paginatedAlbums = albumList.slice(
    (currentAlbumPage - 1) * itemsPerPage1,
    currentAlbumPage * itemsPerPage1
  );
  const totalAlbumPages = Math.ceil(albumList.length / itemsPerPage1);

  return (
    <div className={styles.searchResultsContainer}>
      <h1>Kết quả tìm kiếm: {query}</h1>
      {musicList.length > 0 && (
        <section>
          <h2>Bài hát</h2>
          <div className={styles.musicList}>
            {paginatedMusic.map((music) => (
              <Link
                key={music.id_music}
                href={`/musicdetail/${music.id_music}`}
                className={styles.musicItem}
              >
                <img
                  src={music.url_cover}
                  alt={music.name}
                  className={styles.musicImage}
                />
                <div className={styles.musicInfo}>
                  <p className={styles.musicName}>{music.name}</p>
                  <p className={styles.composerName}>{music.composer}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              disabled={currentMusicPage === 1}
              onClick={() => setCurrentMusicPage(currentMusicPage - 1)}
            >
              Trước
            </button>
            <span>
              Trang {currentMusicPage} / {totalMusicPages}
            </span>
            <button
              disabled={currentMusicPage === totalMusicPages}
              onClick={() => setCurrentMusicPage(currentMusicPage + 1)}
            >
              Sau
            </button>
          </div>
        </section>
      )}

      {albumList.length > 0 && (
        <section>
          <h2>Album</h2>
          <div className={styles.albumGrid}>
            {paginatedAlbums.map((album) => (
              <Link
                key={album.id_album}
                href={`/albumdetail/${album.id_album}`}
                className={styles.albumCard}
              >
                <img
                  src={album.url_cover}
                  alt={album.name}
                  className={styles.albumCover}
                />
                <p className={styles.albumTitle}>{album.name}</p>
                <p className={styles.artistName}>{album.artist?.name}</p>
              </Link>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              disabled={currentAlbumPage === 1}
              onClick={() => setCurrentAlbumPage(currentAlbumPage - 1)}
            >
              Trước
            </button>
            <span>
              Trang {currentAlbumPage} / {totalAlbumPages}
            </span>
            <button
              disabled={currentAlbumPage === totalAlbumPages}
              onClick={() => setCurrentAlbumPage(currentAlbumPage + 1)}
            >
              Sau
            </button>
          </div>
        </section>
      )}

      {artistList.length > 0 && (
        <section>
          <h2>Nghệ sĩ</h2>
          <div className={styles.artistList}>
            {paginatedArtists.map((artist) => (
              <Link
                key={artist.id_artist}
                href={`/artistdetail/${artist.id_artist}`}
                className={styles.artistItem}
              >
                <img
                  src={artist.url_cover}
                  alt={artist.name}
                  className={styles.artistImage}
                />
                <p className={styles.artistName}>{artist.name}</p>
              </Link>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              disabled={currentArtistPage === 1}
              onClick={() => setCurrentArtistPage(currentArtistPage - 1)}
            >
              Trước
            </button>
            <span>
              Trang {currentArtistPage} / {totalArtistPages}
            </span>
            <button
              disabled={currentArtistPage === totalArtistPages}
              onClick={() => setCurrentArtistPage(currentArtistPage + 1)}
            >
              Sau
            </button>
          </div>
        </section>
      )}

      <MusicPartner />
    </div>
  );
};

export default SearchResultsPage;
