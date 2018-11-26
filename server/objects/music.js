const pool = require('./sql').getPool();

class Music{
    constructor(id, name, author, preview_url){
        this.id = id;
        this.name = name;
        this.author = author;
        this.preview_url = preview_url;
    }

    static getMusic(obj){
        return new Music(obj.id, obj.name, obj.author, obj.preview_url);
    }

    static getMusicByID(music_id, callback){
        pool.query("SELECT * FROM musics WHERE id = ? ", [music_id], function(err, quer){
            if (err === null){
                if (quer.length == 1){
                    callback(null, Music.getMusic(quer[0]));
                } else {
                    callback(null, null);
                }
            } else {
                callback(err, null);
            }
        });
    }
}

module.exports = Music;