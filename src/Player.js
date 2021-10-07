import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({
  accessToken,
  trackUri,
  getCurrentPlayingTrack,
}) {
  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      uris={trackUri ? trackUri : []}
      showSaveIcon={false}
      callback={({ track }) => getCurrentPlayingTrack(track)}
    />
  );
}
