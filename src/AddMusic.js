import React, { useState, useEffect } from "react";
import logo from "./img/Spotify_Logo_RGB_Black.png";

export default function AddMusic({ track, playlistTracks, onAddToPlaylist }) {
  const [isOnPlaylist, setIsOnPlaylist] = useState(false);

  useEffect(() => {
    playlistTracks?.forEach((playlistTrack) => {
      if (playlistTrack.track.uri === track.uri) return setIsOnPlaylist(true);
      return setIsOnPlaylist(false);
    });
  }, [track, playlistTracks]);

  if (track?.uri === "") return null;

  const btnColor = isOnPlaylist ? "btn-success" : "btn-dark";

  return (
    <div
      className="d-flex justify-content-between"
      style={{ marginBottom: "2rem" }}
    >
      <button
        type="button"
        className={[`btn ${btnColor}`]}
        onClick={onAddToPlaylist}
      >
        {isOnPlaylist ? "Added" : "Add to Playlist"}
      </button>
      <img src={logo} alt={""} style={{ height: "2rem" }}></img>
    </div>
  );
}
