const ThemeService = require('../services/theme.service');
const GameService = require('../services/game.service');
const UserService = require('../services/user.service');

class GameController{
    createGame(name, theme_id, max_round, callback){
        ThemeService.getThemeByID(theme_id, function(err, theme){
            if (err === null){
                GameService.createGame(name, theme, max_round, callback);
            } else {
                callback(err, null);
            }
        });
    }

    getAvailableGames(callback){
        GameService.getAvailableGames(callback);
    }

    joinGame(user, game_id, callback){
        GameService.getGameByID(game_id, function(err, game){
            if (err === null){
                GameService.joinGame(game, user);
                
                callback(null, game);
            } else {
                callback(err, null);
            }
        });
    }

    leaveGame(user, game_id, callback){
        GameService.getGameByID(game_id, function(err, game){
            if (err === null){
                GameService.leaveGame(game, user);

                callback(null, game);
            } else {
                callback(err, null);
            }
        });
    }

    getUserPoints(user, game_id, callback){
        GameService.getGameByID(game_id, function(err, game){
            if (err === null){
                var points = GameService.getUserPoints(game, user);

                if (GameService.errorHandler.length != 0)
                    callback(GameService.errorHandler[0], null);
                else
                    callback(null, points);
            } else {
                callback(err, null);
            }
        });
    }

    getUserGame(user, callback){
        GameService.getUserGame(user, callback);
    }

    getPlayers(game_id, user, callback){
        GameService.getGameByID(game_id, function(err, game){
            if (err === null){
                var playersID = GameService.getPlayers(game, user);
                
                UserService.getPlayersByIDs(playersID, callback);
            } else {
                callback(err, null);
            }
        });
    }

    startGame(game_id, user, callback){
        GameService.getGameByID(game_id, function(err, game){
            if (err === null){
                GameService.startGame(game, user, callback);
            } else {
                callback(err, null);
            }
        });
    }
}

module.exports = new GameController();