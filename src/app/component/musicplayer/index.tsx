"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import classes from "./musicplayer.module.scss";
import { AppContext } from "@/app/layout";
import clsx from "clsx";
import { ReactSVG } from "react-svg";
import { useRouter } from "next/navigation";

interface Music {
  id_music: string;
  name: string;
  slug: string;
  artists: any[];
  composer: string;
  url_cover: string;
  url_path: string;
}

export const addMusicToTheFirst = (
  state,
  dispatch,
  id_music: string,
  name: string,
  url_path: string,
  url_cover: string,
  composer: string,
  artists: { id_artist: string; name: string }[]
) => {
  localStorage.removeItem("currentPlaylist");
  console.log(state.currentPlaylist);

  dispatch({
    type: "CURRENT_PLAYLIST",
    payload: [
      ...state.currentPlaylist,
      {
        id_music,
        name,
        url_path,
        url_cover,
        composer,
        artists: artists.map((artist) => {
          return { artist };
        }),
      },
    ],
  });
};

export const addMusicToTheEnd = (
  state,
  dispatch,
  id_music: string,
  name: string,
  url_path: string,
  url_cover: string,
  composer: string,
  artists: { id_artist: string; name: string }[]
) => {
  localStorage.removeItem("currentPlaylist");
  console.log(state.currentPlaylist);

  dispatch({
    type: "CURRENT_PLAYLIST",
    payload: [
      {
        id_music,
        name,
        url_path,
        url_cover,
        composer,
        artists: artists.map((artist) => {
          return { artist };
        }),
      },
      ...state.currentPlaylist,
    ],
  });
};

const MusicPlayer: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [music, setMusic] = useState<Music>(state.currentPlaylist[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [showingCurrentTime, setShowingCurrentTime] = useState(0);
  const { currentPlaylist, volume, isPlaying } = state;
  const router = useRouter();

  useEffect(() => {
    if (currentPlaylist && currentPlaylist.length > 0) {
      setMusic(currentPlaylist[0]);
    }
  }, [currentPlaylist]);

  useEffect(() => {
    const loadAudio = async () => {
      if (audioRef.current) {
        audioRef.current.load();
        setCurrentTime(0); // Reset time when loading new audio
        console.log(isPlaying);

        if (isPlaying) audioRef.current?.play();
        else audioRef.current?.pause();
      }
    };

    // Load audio only if URL changes
    loadAudio();
    // console.log(isPlaying, );
  }, [music?.url_path]);

  useEffect(() => {
    const playPauseAudio = async () => {
      if (audioRef.current) {
        try {
          if (isPlaying) {
            await audioRef.current.play();
          } else {
            audioRef.current.pause();
          }
        } catch (error) {
          console.error("Error with play/pause:", error);
        }
      }
    };

    // Toggle play/pause
    playPauseAudio();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        audioRef.current &&
        audioRef.current?.currentTime >= audioRef.current?.duration &&
        currentPlaylist.length > 1
      ) {
        dispatch({
          type: "CURRENT_PLAYLIST",
          payload: currentPlaylist.slice(1),
        });
        dispatch({
          type: "IS_PLAYING",
          payload: true,
        });
      }

      if (
        audioRef.current &&
        audioRef.current?.currentTime >= audioRef.current?.duration &&
        currentPlaylist.length === 1
      ) {
        setCurrentTime(0);
        // audioRef.current.load();
        audioRef.current.play();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlaylist]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setShowingCurrentTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCurrentTime(currentTime);
      console.log(currentTime, showingCurrentTime);
    }
  }, [isPlaying]);

  // useEffect(() => {
  //   const handleTimeUpdate = () => {
  //     if (audioRef.current) setCurrentTime(audioRef.current?.currentTime);
  //   };
  //   const audio = audioRef.current;
  //   if (audio) audio.addEventListener("timeupdate", handleTimeUpdate);
  //   return () => audio?.removeEventListener("timeupdate", handleTimeUpdate);
  // }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
      setShowingCurrentTime(currentTime);
    }
  }, [currentTime]);

  useEffect(() => {
    localStorage.setItem(
      "currentPlaylist",
      JSON.stringify(state.currentPlaylist)
    );
  }, [state.currentPlaylist]);

  // useEffect(() => {
  //   const audio = audioRef.current;

  //   const handleTimeUpdate = () => {
  //     if (audio) {
  //       setCurrentTime(audio.currentTime);
  //       console.log("update: ", audio.currentTime, currentTime, isPlaying);
  //     }
  //   };

  //   if (audio) {
  //     audio.addEventListener("timeupdate", handleTimeUpdate);
  //   }

  //   return () => {
  //     audio?.removeEventListener("timeupdate", handleTimeUpdate);
  //   };
  // }, [isPlaying]);

  function formatTime(seconds) {
    // Tính số phút và giây
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    // Định dạng theo 'mm:ss'
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(secs).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    // <button
    //     onClick={() =>
    //       addMusicToTheFirst(
    //         state,
    //         dispatch,
    //         "m0001",
    //         "Ngày chưa giông bão",
    //         "http://res.cloudinary.com/dmiaubxsm/video/upload/v1727431478/rpmqyciepjvsuwjesfky.mp3",
    //         "http://res.cloudinary.com/dmiaubxsm/image/upload/v1727430608/fy9iie84ei9sybtk8mxu.jpg",
    //         "Ai biết",
    //         [{ id_artist: "a0001", name: "Sơn Tùng" }]
    //       )
    //     }
    //   >
    //     click to add music
    //   </button>
    ////////////////////////////////////////////////////////////////////////////
    // <div className={styles.musicPlayer}>
    //     {music && music.name}
    //     <audio ref={audioRef} src={music?.url_path} controls></audio>
    //     <button onClick={handlePlayPause}>
    //         {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
    //     </button>
    //     <input
    //         max={1}
    //         min={0}
    //         step={0.01}
    //         type="range"
    //         value={volume}
    //         onChange={(e) => dispatch({ type: "VOLUME", payload: parseFloat(e.target.value) })}
    //     />
    // </div>
    <>
      {state.currentPlaylist.length > 0 && (
        <div className={classes.musicPlayerWrapper}>
          <audio
            ref={audioRef}
            src={music?.url_path}
            controls
            hidden
            onLoadedData={() => setDuration(audioRef.current.duration)}
          ></audio>
          <div className={classes.infor}>
            <img
              className={classes.avatar}
              style={{ "--background-url": music?.url_cover || "" } as any}
              src={music?.url_cover}
            />
            <div className={classes.nameWrapper}>
              <div
                className={clsx(classes.name)}
                style={{ "--music-name": music?.name } as any}
                onClick={() => router.push(`/musicdetail/${music.id_music}`)}
              >
                {music?.name} {music?.composer ? <>({music?.composer})</> : ""}{" "}
              </div>
              <div className={classes.artist}>
                {music?.artists &&
                  music.artists.map((artist) => artist.artist.name).join(", ")}
              </div>
            </div>
            {/* <div className={classes.heart}>
              <ReactSVG src="/heart.svg"></ReactSVG>
            </div> */}
            <div className={classes.tool__playingWrapper}>
              <div
                className={clsx(classes.icon, classes.movingBtn)}
                onClick={() => {
                  // audioRef.current?.currentTime =
                  //   audioRef.current?.currentTime - 10 > 0
                  //     ? audioRef.current?.currentTime - 10
                  //     : 0;
                  setCurrentTime((prev) => (prev - 10 > 0 ? prev - 10 : 0));
                  // dispatch({ type: "IS_PLAYING", payload: true });
                }}
              >
                <ReactSVG src="/_previous.svg"></ReactSVG>
              </div>
              {isPlaying && (
                <div
                  className={classes.icon}
                  onClick={() =>
                    dispatch({ type: "IS_PLAYING", payload: false })
                  }
                >
                  <ReactSVG src="/_pause.svg"></ReactSVG>
                </div>
              )}
              {!isPlaying && (
                <div
                  className={classes.icon}
                  onClick={() =>
                    dispatch({ type: "IS_PLAYING", payload: true })
                  }
                >
                  <ReactSVG src="/_play.svg"></ReactSVG>
                </div>
              )}
              <div
                className={clsx(classes.icon, classes.movingBtn)}
                onClick={() => {
                  // audioRef.current?.currentTime =
                  //   audioRef.current?.currentTime + 10 >
                  //   audioRef.current?.duration
                  //     ? audioRef.current?.duration
                  //     : audioRef.current?.currentTime + 10;
                  setCurrentTime((prev) =>
                    prev + 10 > audioRef.current?.duration
                      ? audioRef.current?.duration
                      : audioRef.current?.currentTime + 10
                  );
                  dispatch({ type: "IS_PLAYING", payload: true });
                }}
              >
                <ReactSVG src="/_next.svg"></ReactSVG>
              </div>
            </div>
          </div>
          <div className={classes.tool}>
            {typeof currentTime === "number" && (
              <div className={classes.tool__wrapper}>
                <div className={clsx(classes.time, classes.time__light)}>
                  {formatTime(Math.ceil(audioRef.current?.currentTime || 0))}
                </div>
                <div
                  className={clsx(classes.duration)}
                  style={
                    {
                      "--current-duration": audioRef.current?.duration
                        ? showingCurrentTime / audioRef.current?.duration
                        : 0,
                    } as any
                  }
                >
                  <div
                    className={classes.fill}
                    style={
                      {
                        "--current-duration": audioRef.current?.duration
                          ? showingCurrentTime / audioRef.current?.duration
                          : 0,
                      } as any
                    }
                  ></div>
                  <div
                    className={classes.empty}
                    style={
                      {
                        "--current-duration": audioRef.current?.duration
                          ? currentTime / audioRef.current?.duration
                          : 0,
                      } as any
                    }
                  ></div>
                  <input
                    type="range"
                    value={showingCurrentTime}
                    max={
                      audioRef.current?.duration
                        ? audioRef.current?.duration
                        : 100
                    }
                    min={0}
                    step={1}
                    className={clsx(classes.slider)}
                    onChange={(e) => {
                      setCurrentTime(+e.target.value);
                    }}
                  />
                </div>
                <div className={clsx(classes.time)}>
                  {formatTime(Math.ceil(duration || 100))}
                </div>
              </div>
            )}
          </div>
          <div className={classes.setting}>
            <div className={classes.icon}>
              {volume === 0 && <ReactSVG src="/volume.svg"></ReactSVG>}
              {volume > 0 && volume <= 0.5 && (
                <ReactSVG src="/volume_low.svg"></ReactSVG>
              )}
              {volume > 0.5 && volume <= 1 && (
                <ReactSVG src="/volume_high.svg"></ReactSVG>
              )}
            </div>
            <div className={classes.range}>
              <div
                className={classes.fill}
                style={{ "--volume": volume } as any}
              ></div>
              <div
                className={classes.empty}
                style={{ "--volume": volume } as any}
              ></div>
              <input
                type="range"
                value={volume}
                className={classes.slider}
                max={1}
                min={0}
                step={0.01}
                onChange={(e) =>
                  dispatch({
                    type: "VOLUME",
                    payload: parseFloat(e.target.value),
                  })
                }
              />
             

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
