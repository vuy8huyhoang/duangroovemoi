export type Action = {
  type:
    | "CURRENT_PLAYLIST"
    | "VOLUME"
    | "IS_PLAYING"
    | "SHOW_LOGIN"
    | "SHOW_RIGHT_SIDEBAR"
    | "PROFILE"
    | "SHOW_VIP";
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
    default:
      return state;
  }
};
export { initialState };
