export class SpotifyApi {
    private userToken: string;
    private market: string;

    private constructor(market: string = "GB") {
        this.market = market; // Appears mandatory!
    }

    public async getMe(): Promise<UserResponse> {
        return await this.makeRequest<UserResponse>("GET", "https://api.spotify.com/v1/me");
    }

    private static async authorizeAsUser(clientId: string) {
        //  Set scopes for getting user profile and modifying playlists
        var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "token");
        params.append("redirect_uri", "http://localhost:3000/callback");
        params.append("scope", scope);

        const authUrl = 'https://accounts.spotify.com/authorize?' + params.toString();

        // Redirect to Spotify auth page
        document.location = authUrl;
    }

    public async searchArtists(query: string): Promise<SearchResults> {
        return await this.makeRequest<SearchResults>("GET", `https://api.spotify.com/v1/search?type=artist&market=${this.market}&q=${query}`);
    }

    public async getTopTracksFromArtistId(artistId: string): Promise<TopTracksResult> {
        return await this.makeRequest<TopTracksResult>("GET", `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${this.market}`);
    }

    public async createPlaylist(userId: string, artistName: string, trackIds: string[]): Promise<PlaylistCreationResult> {
        const shortRandomString = Math.random().toString(36).substring(2, 15); // So we can tell playlists apart! :)

        const result = await this.makeRequest<PlaylistCreationResult>("POST", `https://api.spotify.com/v1/users/${userId}/playlists`, {
            name: `My ${artistName} Playlist ` + shortRandomString
        });

        if (trackIds.length > 0) {
            await this.makeRequest("POST", `https://api.spotify.com/v1/playlists/${result.id}/tracks`, {
                uris: trackIds
            });
        }

        return result;
    }

    private async makeRequest<TReturnType>(method: "GET" | "POST", url: string, body: any = undefined): Promise<TReturnType> {
        // Takes care of our HTTP GETs and POSTs
        // Optionally takes a body for POSTs, which is stringified.

        const opts = {
            method: method,
            headers: { Authorization: `Bearer ${this.userToken}` },
            body: body ? JSON.stringify(body) : undefined
        };

        const result = await fetch(url, opts);
        const json = await result.json();
        return json as TReturnType;
    }
        
    public static createClient(clientId: string): SpotifyApi {
        SpotifyApi.authorizeAsUser(clientId); // redirects here for auth!  
        return new SpotifyApi(); // Ignored due to redirect, returned to please the type hints.
    }

    public static createUserAuthenticatedClient(code: string): SpotifyApi {
        // Create SpotifyAPI using private constructor and set userToken
        // Obviously, we're in JavaScript, so nothings really private
        // but this is a nice creation pattern in the user code :)

        const api = new SpotifyApi();
        api.userToken = code;
        return api;
    }
}
