export type Action = {
    type:
    | "CURRENT_PLAYLIST"
    | "VOLUME"
    | "IS_PLAYING"
    payload: any;
};

export const initialState = {
    currentPlaylist: [{
        "id_music": "049c027c-3044-465c-ba27-606383b78e35",
        "name": "Lạ lùng123",
        "url_path": "http://res.cloudinary.com/dmiaubxsm/video/upload/v1730193539/ytnwhat9v2rpziwtcver.mp4",
        "url_cover": "http://res.cloudinary.com/dmiaubxsm/image/upload/v1730193535/gxouisyhhga8lzrjyjow.jpg",
        "artists": [
            {
                "id_artist": "13b5f479-166a-4eb8-9826-a6b3c5be1095",
                "id_music": "049c027c-3044-465c-ba27-606383b78e35",
                "artist": {
                    "id_artist": "13b5f479-166a-4eb8-9826-a6b3c5be1095",
                    "name": "Vũ",
                }
            }
        ],
    },
    {
        "id_music": "m0002",
        "name": "Chắc ai đó sẽ về",
        "url_path": "http://res.cloudinary.com/dmiaubxsm/video/upload/v1727431478/rpmqyciepjvsuwjesfky.mp3",
        "url_cover": "http://res.cloudinary.com/dmiaubxsm/image/upload/v1727430608/fy9iie84ei9sybtk8mxu.jpg",
        "artists": [
            {
                "id_artist": "a0001",
                "id_music": "m0002",
                "artist": {
                    "id_artist": "a0001",
                    "name": "Sơn Tùng MTP",
                    
                }
            }
            ],
        },
    ],

    volume: 0.5,
    isPlaying: false,
};

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
        default:
            return state;
    }
};