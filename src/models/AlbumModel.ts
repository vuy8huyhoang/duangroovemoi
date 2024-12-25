export default interface AlbumModel {
    id_album: string;
    name: string;
    slug: string;
    url_cover: string;
    release_date: string | null;
    publish_by: string | null;
    created_at: string;
    last_update: string;
    is_show: number;
    id_artist: string;
    artist: {
      id_artist: string;
      name: string;
      slug: string;
      url_cover: string;
      created_at: string;
      last_update: string;
      is_show: number;
    };
    musics: {
      index_order: number;
      id_music: string;
      name: string;
      slug: string;
      url_path: string;
      url_cover: string;
      producer: string;
      release_date: string | null;
      created_at: string;
      last_update: string;
      is_show: number;
      composer: string;
      artists: {
        id_artist: string;
        id_music: string;
        artist: {
          id_artist: string;
          name: string;
          slug: string;
          url_cover: string;
          created_at: string;
          last_update: string;
          is_show: number;
        };
      }[];
      id_composer: {
        id_composer: string;
        name: string;
        created_at: string;
        last_update: string;
      };
    }[];
  }
  