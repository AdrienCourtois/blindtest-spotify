const ThemeService = require('../services/theme.service');
const GameService = require('../services/game.service');
const UserService = require('../services/user.service');
const RoundService = require('../services/round.service');
const MusicService = require('../services/music.service');

const Error = require('../services/error');

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

    getGameRound(game_id, round_nb, user, callback){
        GameService.getGameByID(game_id, function(err, game){
            if (err === null){
                // security check
                if (GameService.hasUser(game, user)){
                    RoundService.getRoundByGame(game, function(err, rounds){
                        if (err === null){
                            if (rounds.length < round_nb && round_nb <= game.getRound()){
                                // we have to create a round
                                ThemeService.getThemeByID(game.theme_id, function(err, theme){
                                    if (err === null){
                                        var random_music_id = ThemeService.getRandomMusicID(theme);

                                        MusicService.getMusicByID(random_music_id, function(err, music){
                                            if (err === null){
                                                RoundService.createRound(game, music, function(err, round){
                                                    if (err === null){
                                                        callback(null, round);
                                                    } else {
                                                        callback(err, null);
                                                    }
                                                });
                                            } else {
                                                callback(err, null);
                                            }
                                        });
                                    } else {
                                        callback(err, null);
                                    }
                                });
                            } else if (round_nb > game.getRound()){
                                // there is no round to show, the last one isn't over
                                callback(null, null);
                            } else {
                                // we just return the round asked
                                callback(null, rounds[round_nb]);
                            }
                        } else {
                            callback(err, null);
                        }
                    });
                } else {
                    var error = new Error('Security error at getGameRound', 'Vous n\'avez pas accès à cette fonctionnalité.', 2);
                    callback(error, null);
                }
            } else {
                callback(err, null);
            }
        });
    }
}

module.exports = new GameController();