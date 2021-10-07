import { useState, useEffect } from "react";

import axios from "axios";

const proxyUrl = "https://aqueous-garden-74884.herokuapp.com/";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    axios // !SEARCH THIS
      .post(
        proxyUrl + "https://react-music-rush-server.herokuapp.com:3001/login",
        {
          code,
        }
      )
      .then((res) => {
        // hola
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, null, "/"); // !SEARCH THIS
      })
      .catch(() => {
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios // !SEARCH THIS
        .post(
          proxyUrl +
            "https://react-music-rush-server.herokuapp.com:3001/refresh",
          {
            refreshToken,
          }
        )
        .then((res) => {
          setRefreshToken(res.data.refreshToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch((err) => {
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
