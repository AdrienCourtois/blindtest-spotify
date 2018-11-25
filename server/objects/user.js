const pool = require('./sql').getPool();

class User{
    constructor(id, login, password, game, token){
        this.id = id;
        this.login = login;
        this.password = (typeof(password) == 'undefined') ? null : password;
        this.game = (typeof(game) == 'undefined') ? 0 : game;
        this.token = (typeof(token) == 'undefined') ? null : token;
    }

    inGame(){
        return (this.game > 0);
    }

    getGame(){
        return this.game;
    }

    setGame(game){
        if (game === false)
            game = 0;
        
        this.game = parseInt(game);
    }

    getToken(){
        return this.token;
    }

    setToken(token){
        this.token = token;
    }

    commit(){
        if (this.id == null || isNaN(this.id) || this.id <= 0){
            var self = this;

            pool.query("INSERT INTO users (login, password) VALUES (?, ?)", [this.login, this.password], function(err, quer){
                self.id = quer.insertId;
            });
        } else {
            pool.query("UPDATE users SET login = ?, password = ?, game = ?, token = ? WHERE id = ?", [this.login, this.password, this.game, this.token, this.id]);
        }
    }

    static getUser(obj){
        return new User(obj.id, obj.login, obj.password, obj.game, obj.token);
    }

    static getUserByLogin(login, callback){
        pool.query("SELECT * FROM users WHERE login = ?", [login], function(err, quer){
            if (err === null){
                if (quer.length == 1){
                    callback(null, User.getUser(quer[0]));
                } else {
                    callback(null, null);
                }
            } else {
                callback(err, null);
            }
        });
    }

    static getUserByID(user_id, callback){
        pool.query("SELECT * FROM users WHERE id = ?", [user_id], function(err, quer){
            if (err === null){
                if (quer.length == 1){
                    callback(null, User.getUser(quer[0]));
                } else {
                    callback(null, null);
                }
            } else {
                callback(err, null);
            }
        });
    }

    static getUserByToken(token, callback){
        pool.query("SELECT * FROM users WHERE token = ?", [token], function(err, quer){
            if (err === null){
                if (quer.length == 1){
                    callback(null, User.getUser(quer[0]));
                } else {
                    callback(null, null);
                }
            } else {
                callback(err, null);
            }
        });
    }

    static getPlayersByIDs(ids, callback){
        var where_clause = "0=1";

        for (var i = 0 ; i < ids.length ; i++)
            where_clause += " OR id = " + ids[i];

        pool.query("SELECT id, login, game FROM users WHERE " + where_clause, function(err, quer){
            if (err === null){
                var results = [];

                for (var i = 0 ; i < quer.length ; i++)
                    results.push(User.getUser(quer[i]));
                
                callback(null, results);
            } else {
                callback(err, null);
            }
        });
    }
}

module.exports = User;