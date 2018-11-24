class Game{
    constructor(id, name, theme_id, active, users, points, creation_date){
        this.id = id;
        this.name = name;
        this.theme_id = theme_id;
        this.active = active;
        this.users = users;
        this.points = points;
        this.creation_date = creation_date;
    }

    getUsers(){
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
        return this.points.split(',').map(item => parseInt(item));
    }

    setPoints(points){
        this.points = points.join(',');
    }

    commit(){
        if (this.id === null || isNaN(this.id) || this.id <= 0){
            // insert
        } else {
            // update
        }
    }

    static getAllActiveGames(callback){
        // query
    }

    static getGame(obj){
        return new Game(obj.id, obj.name, obj.theme_id, obj.active, obj.users, obj.points, obj.creation_date);
    }

    static getGameByID(game_id, callback){
        // query
    }
}

module.exports = Game;