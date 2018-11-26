const pool = require('./sql').getPool();

class Round {
    constructor(id, game_id, music_id, done){
        this.id = id;
        this.game_id = game_id;
        this.music_id = music_id;
        this.done = (typeof(done) == 'undefined') ? 0 : 1;
    }

    isDone(){
        return this.done == 1;
    }

    setDone(done){
        this.done = (done) ? 1 : 0;
    }

    getGameID(){
        return this.game_id;
    }

    getMusicID(){
        return this.music_id;
    }

    commit(callback){
        if (typeof(this.id) == "undefined" || isNaN(this.id) || this.id <= 0){
            var self = this;
            pool.query("INSERT INTO rounds (game_id, music_id) VALUES (?, ?)", [this.game_id, this.music_id], function(err, quer){
                self.id = quer.insertId;

                if (typeof(callback) != 'undefined')
                    callback(err, self);
            });
        } else {
            pool.query("UPDATE rounds SET game_id = ?, music_id = ?, done = ? WHERE id = ?", [this.game_id, this.music_id, this.done, this.id]);
        }
    }

    static getRound(obj){
        return new Round(obj.id, obj.game_id, obj.music_id, obj.done);
    }

    static getRoundByID(round_id, callback){
        pool.query("SELECT * FROM rounds WHERE id = ?", [round_id], function(err, quer){
            if (err === null){
                if (quer.length == 1)
                    callback(null, Round.getRound(quer[0]));
                else
                    callback(null, null);
            } else {
                callback(err, null);
            }
        });
    }

    static getRoundsByGameID(game_id, callback){
        pool.query("SELECT * FROM rounds WHERE game_id = ?", [game_id], function(err, quer){
            if (err === null){
                var results = [];

                for (var i = 0 ; i < quer.length ; i++)
                    results.push(Round.getRound(quer[i]));
                
                callback(null, results);
            } else {
                callback(err, null);
            }
        });
    }
}

module.exports = Round;