import React from "react";

export default function SongInfo({ track }) {
  return (
    <div className="d-flex flex-column align-items-center">
      <img
        src={track?.image[0]?.albumUrl}
        alt={""}
        style={{ width: "90%", maxWidth: "420px", marginBottom: "2rem" }}
      />
      <h1 className="text-center">{track.name}</h1>
      <h1 className="text-center text-muted">{track.artists}</h1>
    </div>
  );
}
