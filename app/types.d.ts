interface AccessToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface SearchResults {
    artists: ArtistSearchResult;
}

interface ArtistSearchResult {
    href: string;
    items: ArtistSearchResultItem[];
}

interface ArtistSearchResultItem {
    id: string;
    name: string;
    popularity: number;
    genres: string[];
}

interface TopTracksResult {
    tracks: Track[];
}

interface Track {
    id: string;
    name: string;
    uri: string;
}

interface UserResponse {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean,
        filter_locked: boolean
    },
    external_urls: { spotify: string; };
    followers: { href: string; total: number; };
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}

interface Image {
    url: string;
    height: number;
    width: number;
}

interface PlaylistCreationResult {
    id: string;
    name: string;
    href: string;
    external_urls: { spotify: string; };
}