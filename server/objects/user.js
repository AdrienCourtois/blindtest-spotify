const pool = require('sql').getPool();

class User{
    constructor(id, login, password, game){
        this.id = id;
        this.login = login;
        this.password = password;
        this.game = (!game) ? 0 : game;
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

    commit(){
        if (this.id == null || !isNaN(this.id) || this.id <= 0){
            var self = this;

            pool.query("INSERT INTO users (login, password) VALUES (?, ?)", [this.login, this.password], function(err, quer){
                self.id = quer.insertId;
            });
        } else {
            pool.query("UPDATE users SET login = ?, password = ?, game = ? WHERE id = ?", [this.login, this.password, this.game, this.id]);
        }
    }

    static getUser(obj){
        return new User(obj.id, obj.login, obj.password, obj.game);
    }

    static getUserByLogin(login, callback){
        pool.query("SELECT * FROM users WHERE login = ?", [login], function(err, quer){
            if (err === null){
                callback(null, User.getUser(quer[0]));
            } else {
                callback(err, null);
            }
        });
    }

    static getUserByID(user_id, callback){
        pool.query("SELECT * FROM users WHERE id = ?", [user_id], function(err, quer){
            if (err === null){
                callback(null, User.getUser(quer[0]));
            } else {
                callback(err, null);
            }
        });
    }
}

module.exports = User;