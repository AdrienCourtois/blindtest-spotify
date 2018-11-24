class User{
    constructor(id, login, password, game){
        this.id = id;
        this.login = login;
        this.password = password;
        this.game = game;
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
            // insert
        } else {
            // update
        }
    }

    static getUser(obj){
        return new User(obj.id, obj.login, obj.password, obj.game);
    }

    static getUserByLogin(login, callback){
        // query
    }
}

module.exports = User;