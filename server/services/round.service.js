const Game = require('../objects/game');
const Round = require('../objects/round');

class RoundService {
    constructor(){
        this.errorHandler = [];
    }

    /**
     * Returns a Round object based on its ID.
     * @param {number} round_id The id of the Round object wanted
     * @param {callbackRound} callback The callback function taking the Round object as parameter.
     */
    getRoundByID(round_id, callback){
        Round.getRoundByID(round_id, function(err, round){
            if (err === null){
                if (round !== null){
                    callback(null, round);
                } else {
                    var error = new Error('Structural error at getRoundByID', 'Aucun round ne correspond à l\'ID transmise', 0);
                    this.errorHandler.push(error);

                    callback(error, null);
                }
            } else {
                var error = new Error('SQL error at getRoundByID', err, 1);
                this.errorHandler.push(error);

                callback(error, null);
            }
        });
    }

    /**
     * Retrieves all the Round for a given Game object, ordered by ID.
     * @param {Game} game The Game object
     * @param {callbackRoundArray} callback The callback function taking the Round objects as param.
     */
    getRoundByGame(game, callback){
        Round.getRoundsByGameID(game.id, function(err, rounds){
            if (err === null){
                var ordered_rounds = rounds.sort((a, b) => (a.id > b.id) ? -1 : ((b.id > a.id) ? 1 : 0));

                callback(null, ordered_rounds);
            } else {
                var error = new Error('SQL error at getRoundByGame', err, 1);
                this.errorHandler.push(error);

                callback(error, null);
            }
        });
    }

    /**
     * Creates a new Round for a given Game
     * @param {Game} game The Game object
     * @param {Music} music The music that'll be played for the given round
     * @param {callbackRound} callback The callback function taking the new Round object as parameter.
     */
    createRound(game, music, callback){
        var new_round = Round.getRound({
            game_id: game.id,
            music_id: music.id
        });
        var self = this;

        new_round.commit(function(err, round){
            if (err === null){
                callback(null, round);
            } else {
                var error = new Error('SQL error at createRound', err, 1);
                self.errorHandler.push(error);

                callback(error, null);
            }
        });

        return new_round;
    }
}

/**
 * Callback function called with the asked Round object as param
 * @callback callbackRound
 * @param {Error} error
 * @param {Round} round
 */


 /**
  * Callback function called with the asked Round objects as param
  * @callback callbackRoundArray
  * @param {Error} error
  * @param {Round[]} rounds
  */

module.exports = new RoundService();