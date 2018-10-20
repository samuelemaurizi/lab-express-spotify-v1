// Setup
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// hbs.registerPartial(__dirname + "/views/partials");

// Spotify Credentil
const clientId = "314baa8e0b7b4e6ea8f5103d140b261a";
const clientSecret = "2f9947aaf1c942d083fae00910757598";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrive an access token
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

// Morgan
app.use(morgan("dev"));

/////////// Routes
//// Home and Search
app.get("/", (req, res, next) => {
  res.render("index");
});

//// Search result
app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      // console.log(data);
      res.render("artists", { artists: data.body.artists.items });
    })
    .catch(err => {
      console.log("Something went wrong!", err);
    });
});

//// Artist albums
app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      // res.send(req.params);
      res.render("albums", {
        albums: data.body.items
      });
    })
    .catch(err => {
      console.log("Something went wrong!", err);
    });
});

//// Albums Tracks
app.get("/tracks/:trackId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.trackId)
    .then(data => {
      // res.send(data);
      res.render("tracks", { tracks: data.body.items });
    })
    .catch(err => {
      console.log("Something went wrong!", err);
    });
});

// Server connection
app.listen(3000, () => {
  console.log("You are connected...");
});
