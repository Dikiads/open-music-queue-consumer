const { Pool } = require("pg");

class PlaylistsService {
    constructor(){
        this._pool = new Pool();
    }
    async getPlaylistById(playlistId, owner){
        const query = {
            text: `SELECT p.id AS playlist_id, p.name AS playlist_name,
                      s.id AS song_id, s.title AS song_title, s.performer AS song_performer 
               FROM playlists p 
               LEFT JOIN playlists_songs ps ON p.id = ps."playlistId" 
               LEFT JOIN songs s ON ps."songId" = s.id 
               WHERE p.id = $1 AND p.owner = $2`,
               values: [playlistId, owner]
        };

        const result = await this._pool.query(query);
        const playlist = {
            id: result.rows[0].playlist_id,
            name: result.rows[0].playlist_name,
            songs: result.rows
                .filter(song => song.song_id !== null)
                .map(song => ({
                    id: song.song_id,
                    title: song.song_title,
                    performer: song.song_performer
                }))
        }
        return playlist;
    }
};

module.exports = PlaylistsService;