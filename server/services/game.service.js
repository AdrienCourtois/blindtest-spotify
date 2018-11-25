const Game = require('../objects/game');
const User = require('../objects/user');
const Theme = require('../objects/theme');
const Error = require('./error');

class GameService{
    constructor(){
        this.errorHandler = [];
    }
    
    /**
     * Retrieves all the available games
     * @param {gamesCallback} callback The callback function that'll be called when the games will be loaded.
     */
    getAvailableGames(callback){
        var self = this;

        Game.getAllActiveGames(function(err, games){
            if (err === null)
                callback(null, games);
            else {
                var error = new Error('SQL error at getAvailableGames', err, 1);
                self.errorHandler.push(error);

                callback(error, null);
            }
        });
    }

    /**
     *  Returns the game the given user is in.
     * @param {User} user The User object we're asking the game for.
     * @param {gameCallback} callback The callback function taking the asked game as parameter, null if the user is not in a game. 
     */
    getUserGame(user, callback){
        if (user.inGame()){
            var user_game = user.getGame();
            var self = this;

            Game.getGameByID(user_game, function(err, game){
                if (err === null)
                    callback(null, game);
                else {
                    var error = new Error('SQL error at getUserGame', err, 1);
                    self.errorHandler.push(error);

                    callback(error, null);
                }
            });
        } else {
            var error = new Error('Structural error at getUserGame', 'L\'utilisateur n\'est pas dans une partie actuellement.', 0);
            this.errorHandler.push(error);

            callback(error, null);
        }
    }

    /**
     * Returns a Game object according to its ID.
     * @param {number} game_id The ID of the game requested 
     * @param {gameCallback} callback The callback function taking the asked game as parameter, null if there's no game corresponding to this ID.
     */
    getGameByID(game_id, callback){
        var self = this;

        Game.getGameByID(game_id, function(err, game){
            if (err === null)
                callback(null, game);
            else {
                var error = new Error('SQL error at getGameID', err, 1);
                self.errorHandler.push(error);

                callback(error, null);
            }
        });
    }

    /**
     * Returns a boolean saying if wether or not a given user is in a game
     * @returns {boolean}
     * @param {Game} game The Game object we want to know if the user is in
     * @param {User} user The User object we want to know if it is in the Game
     */
    hasUser(game, user){
        var users = game.getUsers();

        return users.indexOf(user.id) >= 0;
    }

    /**
     * Adds an user to a given game.
     * @param {Game} game The Game object we want to go to
     * @param {User} user The User object that wants to join
     */
    joinGame(game, user){
        if (!game.isActive()){
            var error = new Error('Structural error at joinGame', 'La partie que vous essayez de joindre n\'existe plus', 0);
            this.errorHandler.push(error);
        } else {
            if (this.hasUser(game, user)){
                var error = new Error('Structural error at joinGame', 'Vous êtes déjà dans cette partie.', 0);
                this.errorHandler.push(error);
            } else {
                if (user.inGame()){
                    var error = new Error('Structural error at joinGame', 'Vous êtes déjà dans une partie', 0);
                    this.errorHandler.push(error);
                } else {
                    // adding the user in the Game object
                    var game_users = game.getUsers();
                    game_users.push(user.id);

                    game.setUsers(game_users);
                    
                    // adding a score to the user
                    var points = game.getPoints();
                    points.push(0);

                    game.setPoints(points);

                    // setting the user as being in a game
                    user.setGame(game.id);

                    user.commit();
                    game.commit();
                }
            }
        }
    }

    /**
     * Removes an user from a given game, and put the game as unactive if there's no player left.
     * @param {Game} game The Game object we want to leave from
     * @param {User} user The User object that wants to leave
     */
    leaveGame(game, user){
        var game_users = game.getUsers();
        var points = game.getPoints();

        var index = game_users.indexOf(user.id); 

        if (index >= 0){
            points.splice(index, 1);
            game_users.splice(index, 1);
        }

        game.setUsers(game_users);
        game.setPoints(points);

        // checking if the game is empty
        if (game_users.length == 0)
            game.setActive(false);

        user.setGame(false);

        game.commit();
        user.commit();
    }
    
    /**
     * Returns the points of an user for a given game.
     * @param {Game} game The Game object we want to get the points from.
     * @param {User} user The User object we want the points of.
     */
    getUserPoints(game, user){
        if (user.inGame()){
            if (this.hasUser(game, user)){
                var points = game.getPoints();
                var users = game.getUsers();

                var index = users.indexOf(user.id);

                return points[index];
            } else {
                var error = new Error('Structural error at getUserPoints', 'Vous n\'êtes pas dans cette partie', 0);
                this.errorHandler.push(error);
            }
        } else {
            var error = new Error('Structural error at getUserPoints', 'L\'utilisateur n\'est pas dans une partie.', 0);
            this.errorHandler.push(error);
        }

        console.log(this.errorHandler);

        return null;
    }

    /**
     * Creates a game with the given name if possible.
     * @param {string} name The name of the game. 
     * @param {Theme} theme_id The ID of the theme for the game.
     * @param {gameCallback} callback The callback function taking the game as parameters if it has been created and null if there was an error.
     */
    createGame(name, theme, max_round, callback){
        if (name.length > 1){
            var new_game = Game.getGame({
                theme_id: theme.id,
                name: name,
                max_round: max_round
            });

            new_game.commit();
            
            callback(null, new_game);
        } else {
            var error = new Error('Form input error at createGame', 'Le nom entré est trop court.', 0);
            this.errorHandler.push(error);

            callback(error, null);
        }
    }

    /**
     * Retrieves the game corresponding to the given ID.
     * @param {number} game_id The game ID.
     * @param {gameCallback} callback The callback function taking the found game as parameter.
     */
    getGameByID(game_id, callback){
        var self = this;

        Game.getGameByID(game_id, function(err, game){
            if (err === null){
                if (game !== null){
                    callback(null, game);
                } else {
                    var error = new Error('Structural error at getGameByID', 'La partie sélectionnée n\'existe pas.', 0);
                    self.errorHandler.push(error);

                    callback(error, null);
                }
            } else {
                var error = new Error('SQL error at getGameByID', err, 1);
                self.errorHandler.push(error);

                callback(error, null);
            }
        });
    }

    /**
     * Retrieves the players ID from a given game
     * @param {Game} game The game
     * @param {User} user The user asking for it -- for security
     * @returns {number[]}
     */
    getPlayers(game, user){
        if (this.hasUser(game, user)){
            return game.getUsers();
        } else {
            var error = new Error('Security error at getPlayers', 'Vous n\'avez pas accès à cette fonctionnalité.', 2);
            self.errorHandler.push(error);
        }

        return null;
    }

    /**
     * Starts the game
     * @param {Game} game The given game
     * @param {User} user The user that's asking for it -- for security
     * @param {gameCallback} callback The callback function taking the updated game as argumnet.
     */
    startGame(game, user, callback){
        if (this.hasUser(game, user)){
            game.setStarted(true);
            game.commit();

            callback(null, game);
        } else {
            var error = new Error('Security error at startGame', 'Vous n\'avez pas accès à cette fonctionnalité', 2);
        }
    }
}

module.exports = new GameService();

/**
 * Callback function called with the asked games as param.
 * @callback gamesCallback
 * @param {Error} error
 * @param {Array.<Game>} games
 */

 /**
  * Callback function called with the asked game as param.
  * @callback gameCallback
  * @param {Error} error
  * @param {Game} game
  */