const MusicService = require('../services/music.service');

class MusicController{
    getMusicByID(music_id, callback){
        MusicService.getMusicByID(music_id, callback);
    }
}

module.exports = new MusicController();