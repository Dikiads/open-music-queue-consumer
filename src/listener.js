class Listener {
    constructor(playlistsService, mailSender){
        this._playlistsService = playlistsService;
        this._mailSender = mailSender;

        this.listen = this.listen.bind(this);
    };

    async listen(message){
        console.log('Pesan diterima oleh Listener:', message.content.toString());
        try {
            const { playlistId, userId, targetEmail } = JSON.parse(message.content.toString());
            console.log('Playlist ID:', playlistId, 'User ID:', userId)
            const playlist = await this._playlistsService.getPlaylistById(playlistId, userId);
            const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlist));
            console.log('Email berhasil dikirim:', result);
            console.log(result);
          } catch (error) {
            console.error(error);
          }
    }

};




module.exports = Listener;