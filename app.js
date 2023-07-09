require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

app.get("/", (request, response) => {
  response.render("home");
});

//Getting the search request and rendering a results page
app.get("/artist-search", async (request, response) => {
  try {
    const body = request.query;
    const artistsSearch = await spotifyApi.searchArtists(body.artist);
    console.log("The received data from the API: ", artistsSearch);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    response.render("artist-search-results", {
      artists: artistsSearch.body.artists.items,
    });
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
  }
});

//Getting the albums page
app.get("/albums/:artistId", async (request, response) => {
  try {
    const artistId = request.params.artistId;
    const artistAlbums = await spotifyApi.getArtistAlbums(artistId);
    response.render("albums", { albums: artistAlbums.body });
  } catch (err) {
    console.log("The error while searching artist's albums occurred: ", err);
  }
});

//Getting the tracks of the album
app.get("/tracks/:albumId", async (request, response) => {
  try {
    const albumId = request.params.albumId;
    const albumTracks = await spotifyApi.getAlbumTracks(albumId);
    response.render("tracks", { tracks: albumTracks.body });
  } catch (err) {
    console.log("The error while searching album's tracks occurred: ", err);
  }
});