import React from "react";

import logo from "./img/Spotify_Logo_RGB_Black.png";

import { Container } from "react-bootstrap";

// GET Request to Spotify API using our Client ID
const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=19fbc1a2a4924852b1b82237f0e3157b&response_type=code&redirect_uri=https://fpladano.github.io/music-rush-client/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-public%20user-top-read%20user-library-read%20user-library-modify";

export default function Login() {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="display-1">Music Rush</h1>
      <p
        className="display-6 text-center text-muted"
        style={{ marginBottom: "1.8rem" }}
      >
        Create a Playlist just for You!
      </p>
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
      <div>
        <img
          src={logo}
          alt={""}
          style={{ height: "2rem", marginTop: "2rem" }}
        ></img>
      </div>
    </Container>
  );
}
