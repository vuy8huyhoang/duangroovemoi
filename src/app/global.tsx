export type Action = {
  type:
    | "CURRENT_PLAYLIST"
    | "VOLUME"
    | "IS_PLAYING"
    | "SHOW_LOGIN"
    | "SHOW_RIGHT_SIDEBAR"
    | "PROFILE"
    | "SHOW_VIP"
    | "PLAYLIST"
    | "FAVORITE_ALBUM"
    | "SHOW_CHANGE_PASSWORD"
    | "CURRENT_DURATION"
    | "PLAYLIST_LAYER"
    | "ADMIN_SIDEBAR"
    | "FAVORITE_MUSIC";
  payload: any;
};
let initialState;
if (typeof window !== "undefined") {
  initialState = {
    currentPlaylist: JSON.parse(localStorage.getItem("currentPlaylist")) || [],
    volume: 0.5,
    isPlaying: false,
    showLogin: false,
    showRightSidebar: false,
    showVIP: false,
    profile: null,
    playlist: [],
    favoriteAlbum: [],
    favoriteMusic: [],
    showChangePassword: false,
    currentDuration: 0,
    playlistLayer: "",
    adminSidebar: false,
  };
}

// Reducer
export const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "CURRENT_PLAYLIST":
      return {
        ...state,
        currentPlaylist: action.payload,
      };
    case "VOLUME":
      return {
        ...state,
        volume: action.payload,
      };
    case "IS_PLAYING":
      return {
        ...state,
        isPlaying: action.payload,
      };
    case "SHOW_LOGIN":
      return {
        ...state,
        showLogin: action.payload,
      };
    case "SHOW_RIGHT_SIDEBAR":
      return {
        ...state,
        showRightSidebar: action.payload,
      };
    case "SHOW_VIP":
      return {
        ...state,
        showVIP: action.payload,
      };
    case "PROFILE":
      return {
        ...state,
        profile: action.payload,
      };
    case "PLAYLIST":
      return {
        ...state,
        playlist: action.payload,
      };
    case "FAVORITE_ALBUM":
      return {
        ...state,
        favoriteAlbum: action.payload,
      };
    case "FAVORITE_MUSIC":
      return {
        ...state,
        favoriteMusic: action.payload,
      };
    case "SHOW_CHANGE_PASSWORD":
      return {
        ...state,
        showChangePassword: action.payload,
      };
    case "CURRENT_DURATION":
      return {
        ...state,
        currentDuration: action.payload,
      };
    case "PLAYLIST_LAYER":
      return {
        ...state,
        playlistLayer: action.payload,
      };
    case "ADMIN_SIDEBAR":
      return {
        ...state,
        adminSidebar: action.payload,
      };
    default:
      return state;
  }
};
export { initialState };
