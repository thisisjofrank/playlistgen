import { SpotifyApi } from "./SpotifyApi";

// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment

const params = new URLSearchParams(window.location.hash.substring(1));  
const code = params.get("access_token");

// If there's a callback on the query string, pass it to our API client
// otherwise, create a client with our client ID to trigger a redirect / auth flow

const api = code
    ? SpotifyApi.createUserAuthenticatedClient(code) 
    : SpotifyApi.createClient("dd44b26e46f349a0b21231b5beb3c70c");

// Sequences calls over the Spotify API to search for an artist, 
// get their top tracks, and create a playlist

async function createPlaylist(artistName: string) {
    const searchResults = await api.searchArtists(artistName);
    const artist = searchResults.artists.items[0];

    const topTracks = await api.getTopTracksFromArtistId(artist.id);

    //more than 5 returned, we take only the top 5 and get their uri (unique resource indicator, in this case a url)
    const topFiveTracks = topTracks.tracks.slice(0, 5).map(t => t.uri);

    // We need to get the current auth'd userId to pass to createPlaylist
    // This could perhaps be cached inside the SpotifyAPI client class.
    const me = await api.getMe();

    const playlist = await api.createPlaylist(me.id, artist.name, topFiveTracks);
    
    // UI update
    const anchor = document.createElement("a");
    anchor.href = playlist.external_urls.spotify;
    anchor.text = playlist.name;
    anchor.setAttribute("target", "_blank");

    document.body.appendChild(anchor);
}

// Wire up lo-fi UI to the above function

document.getElementById("makePlaylist").addEventListener("click", (e) => {
    const artistName = (document.getElementById("artistName") as HTMLInputElement).value;
    createPlaylist(artistName);
});
