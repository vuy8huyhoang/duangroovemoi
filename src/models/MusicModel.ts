export default interface MusicModel {
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
  artists: Array<{
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
  }>;
  types: Array<{
    id_music: string;
    id_type: string;
    type: {
      id_type: string;
      name: string;
      slug: string;
      created_at: string;
      is_show: number;
    };
  }>;
  id_composer: string;
  favorite: number;
  view: number;
}
