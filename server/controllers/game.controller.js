const ThemeService = require('../services/theme.service');
const GameService = require('../services/game.service');

class GameController{
    createGame(name, theme_id, callback){
        ThemeService.getThemeByID(theme_id, function(err, theme){
            if (err === null){
                GameService.createGame(name, theme, callback);
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

                callback(null, points);
            } else {
                callback(err, null);
            }
        });
    }

    getUserGame(user, callback){
        GameService.getUserGame(user, callback);
    }
}

module.exports = new GameController();