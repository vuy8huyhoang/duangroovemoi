export type Action = {
  type: "CURRENT_PLAYLIST" | "VOLUME" | "IS_PLAYING" | "SHOW_LOGIN";
  payload: any;
};
let initialState
if (typeof window !== "undefined") {
   initialState = {

    currentPlaylist: JSON.parse(localStorage.getItem("currentPlaylist")) || [],
    volume: 0.5,
    isPlaying: false,
    showLogin: false,
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
    default:
      return state;
  }
};
export { initialState };
