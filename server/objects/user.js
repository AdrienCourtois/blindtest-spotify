const pool = require('./sql').getPool();

class User{
    constructor(id, login, password, game, token){
        this.id = id;
        this.login = login;
        this.password = password;
        this.game = (!game) ? 0 : game;
        this.token = token;
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
}

module.exports = User;