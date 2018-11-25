const pool = require('./sql').getPool();

class Game{
    constructor(id, name, theme_id, active, users, points, creation_date, started, current_round, max_round){
        this.id = id;
        this.name = name;
        this.theme_id = theme_id;
        this.active = (typeof(active) == "undefined") ? 1 : active;
        this.users = (typeof(users) == "undefined") ? '' : users;
        this.points = (typeof(points) == "undefined") ? '' : points;
        this.creation_date = creation_date;
        this.started = (typeof(started) == "undefined") ? 0 : started;
        this.current_round = (typeof(current_round) == "undefined") ? 0 : current_round;
        this.max_round = (typeof(max_round) == "undefined") ? 20 : max_round;
    }

    getUsers(){
        if (this.users.length == 0)
            return [];
        else
            return this.users.split(',').map(item => parseInt(item));
    }

    setUsers(users){
        this.users = users.join(',');
    }

    isActive(){
        return (this.active == 1);
    }

    setActive(state){
        this.active = (state) ? 1 : 0;
    }

    hasStarted(){
        return (this.started == 1);
    }

    setStarted(started){
        this.started = (started) ? 1 : 0;
    }

    getPoints(){
        if (this.points.length == 0)
            return [];
        else
            return this.points.split(',').map(item => parseInt(item));
    }

    setPoints(points){
        this.points = points.join(',');
    }

    commit(){
        if (this.id === null || isNaN(this.id) || this.id <= 0){
            var self = this;

            pool.query("INSERT INTO games (name, theme_id, users, points, max_round) VALUES (?, ?, '', '', ?)", [this.name, this.theme_id, this.max_round], function(err, quer){
                self.id = quer.insertId;
                self.creation_date = "" + new Date();
            });
        } else {
            pool.query("UPDATE games SET name = ?, theme_id = ?, active = ?, users = ?, points = ?, started = ?, current_round = ?, max_round = ? WHERE id = ?", [this.name, this.theme_id, this.active, this.users, this.points, this.started, this.current_round, this.max_round, this.id]);
        }
    }

    static getAllActiveGames(callback){
        pool.query("SELECT * FROM games WHERE active = 1", function(err, quer){
            if (err == null){
                var result = [];

                for (var i = 0 ; i < quer.length ; i++)
                    result.push(Game.getGame(quer[i]));
                
                callback(null, result);
            } else 
                callback(err, null);
        });
    }

    static getGame(obj){
        return new Game(obj.id, obj.name, obj.theme_id, obj.active, obj.users, obj.points, obj.creation_date, obj.started, obj.current_round, obj.max_round);
    }

    static getGameByID(game_id, callback){
        pool.query("SELECT * FROM games WHERE id = ?", [game_id], function(err, quer){
            if (err === null)
                if (quer.length == 1){
                    callback(null, Game.getGame(quer[0]));
                } else {
                    callback(null, null);
                }
            else 
                callback(err, null);
        });
    }
}

module.exports = Game;