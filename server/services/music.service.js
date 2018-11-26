const Music = require('../objects/music');
const Error = require('./error');

class MusicService{
    constructor(){
        this.errorHandler = [];
    }

    /**
     * Retrieves a Music object by its ID.
     * @param {number} music_id The music ID
     * @param {callbackMusic} callback The callback function taking the asked Music object as parameter
     */
    getMusicByID(music_id, callback){
        var self = this;

        Music.getMusicByID(music_id, function(err, music){
            if (err === null){
                if (music !== null){
                    callback(null, music);
                } else {
                    var error = new Error('Structural error at getMusicByID', 'La musique demandée n\'existe pas.', 0);
                    self.errorHandler.push(error);

                    callback(error, null);
                }
            } else {
                var error = new Error('SQL error at getMusicByID', err, 1);
                self.errorHandler.push(error);

                callback(error, null);
            }
        });
    }
}

/**
 * Callback function called with the Music object as param.
 * @callback callbackMusic
 * @param {Error} error
 * @param {Music} music
 */

module.exports = new MusicService();