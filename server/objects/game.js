const pool = require('./sql').getPool();

class Game{
    constructor(id, name, theme_id, active, users, points, creation_date){
        this.id = id;
        this.name = name;
        this.theme_id = theme_id;
        this.active = (!active) ? 1 : active;
        this.users = (!users) ? '' : users;
        this.points = (!points) ? '' : points;
        this.creation_date = creation_date;
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

            pool.query("INSERT INTO games (name, theme_id, users, points) VALUES (?, ?, '', '')", [this.name, this.theme_id], function(err, quer){
                self.id = quer.insertId;
                self.creation_date = "" + new Date();
            });
        } else {
            pool.query("UPDATE games SET name = ?, theme_id = ?, active = ?, users = ?, points = ? WHERE id = ?", [this.name, this.theme_id, this.active, this.users, this.points, this.id]);
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
        return new Game(obj.id, obj.name, obj.theme_id, obj.active, obj.users, obj.points, obj.creation_date);
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