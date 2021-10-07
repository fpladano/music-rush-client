import React, { useState, useEffect } from "react";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import Navbar from "./Navbar";
import AddMusic from "./AddMusic";
import Player from "./Player";
import SongInfo from "./SongInfo";

import { Container } from "react-bootstrap";

const spotifyApi = new SpotifyWebApi({
  clientId: "19fbc1a2a4924852b1b82237f0e3157b",
});

export default function Dashboard({ code }) {
  // Access Token Auth
  const accessToken = useAuth(code);

  // Setting States
  const [userTracksSeed, setUserTracksSeed] = useState();
  const [recommendedResults, setRecommendedResults] = useState([]);
  const [currentTrack, setCurrentTrack] = useState();
  const [userProfile, setUserProfile] = useState();
  const [appPlaylist, setAppPlaylist] = useState();

  // Access Token Request
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  //Request User Profile
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi
      .getMe()
      .then((data) => {
        setUserProfile({
          id: data.body.id,
          name: data.body.display_name,
          image: data.body.images[0].url,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  // App Playlist Setup
  useEffect(() => {
    if (!accessToken) return;

    // Getting All Playlist from the User
    spotifyApi
      .getUserPlaylists()
      .then((data) => {
        let playlistExist = false;

        // Check If Music Rush Playlist exist
        data.body.items.forEach((playlist) => {
          if (playlist.name === "Music Rush") {
            playlistExist = true;
            spotifyApi
              .getPlaylist(playlist.id)
              .then((data) => {
                return setAppPlaylist(data.body);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });

        //If no Music Rush Playlist exist we create one
        if (!playlistExist) {
          spotifyApi
            .createPlaylist("Music Rush", {
              description:
                "Playlist created with React.JS by Francisco Pladano",
              public: true,
            })
            .then((data) => {
              return setAppPlaylist(data.body);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })

      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  // User Top Tracks Request
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi
      .getMyTopTracks({ limit: 5 })
      .then((data) => {
        let topTracks = data.body.items;
        setUserTracksSeed(topTracks.map((track) => track.id));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  // User Recommended Track Request
  useEffect(() => {
    if (!userTracksSeed) return;
    if (!accessToken) return;

    spotifyApi
      .getRecommendations({ seed_tracks: userTracksSeed })
      .then((data) => {
        setRecommendedResults(
          data.body.tracks.map((track) => {
            // Getting Smallest Album Image
            const smallestAlbumImage = track.album.images.reduce(
              (smallest, image) => {
                if (image.height > smallest.height) return image;
                return smallest;
              },
              track.album.images[0]
            );

            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: smallestAlbumImage.url,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userTracksSeed, accessToken]);

  // Get Current Track from Player
  function currentPlayingTrack(track) {
    let songName = track.name;
    let largeImage = recommendedResults.filter(
      (recommendedTrack) => recommendedTrack.title === songName
    );
    setCurrentTrack({
      name: track.name,
      artists: track.artists,
      image: largeImage,
      uri: track.uri,
    });
  }

  // Add track to playlist
  function addToPlaylist() {
    let isOnPlaylist = false;

    // Check is current track is on the playlist
    appPlaylist.tracks.items.forEach((playlistTrack) => {
      if (playlistTrack.track.uri === currentTrack.uri)
        return (isOnPlaylist = true);
    });
    if (isOnPlaylist) return;

    // Adding Track
    spotifyApi
      .addTracksToPlaylist(appPlaylist.id, [currentTrack.uri])
      .then((data) => {
        // Track Added Now Updating Playlist State to show new Track
        spotifyApi
          .getPlaylist(appPlaylist.id)
          .then((data) => {
            setAppPlaylist(data.body);
          })
          .catch((err) => {
            console.log(err);
          });
      })

      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <div>{userProfile && <Navbar userInfo={userProfile} />}</div>
      {/* Track Info */}
      <div
        className="d-flex flex-grow-1 my-2 justify-content-center align-items-center"
        style={{ overflow: "scroll" }}
      >
        {currentTrack && <SongInfo track={currentTrack} />}
      </div>
      {/* Add to Music Rush */}
      <div>
        <AddMusic
          track={currentTrack}
          playlistTracks={appPlaylist?.tracks.items}
          onAddToPlaylist={addToPlaylist}
        />
      </div>
      {/* Player */}
      <div>
        <Player
          accessToken={accessToken}
          trackUri={recommendedResults.map((track) => {
            return track.uri;
          })}
          getCurrentPlayingTrack={currentPlayingTrack}
        />
      </div>
    </Container>
  );
}
