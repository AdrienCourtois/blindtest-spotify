const md5 = require('md5');

const User = require('../objects/user');
const Error = require('./error');

class UserService{
    constructor(){
        this.errorHandler = [];
    }

    /**
     * Tries to login the user if the given credientials corresponds to something
     * @param {string} login The login of the user.
     * @param {string} password The password of the user.
     * @param {userCallback} callback The callback function taking the user as parameter if it matched, null else
     */
    login(login, password, callback){
        var hashed_password = this.passwordHash(login, password);
        var self = this;

        User.getUserByLogin(login, function(err, user){
            if (err === null){
                if (user !== null){
                    if (user.password == hashed_password){
                        require('crypto').randomBytes(48, function(err, buffer) {
                            var token = buffer.toString('hex');

                            user.setToken(token);
                            user.commit();

                            callback(null, user);
                        });
                    } else {
                        var error = new Error('Form input error at login', 'Le nom de compte ou le mot de passe entré est incorrect.', 0);
                        self.errorHandler.push(error);

                        callback(error, null);
                    }
                } else {
                    var error = new Error('Form input error at login', 'Le nom de compte ou le mot de passe entré est incorrect.', 0);
                    self.errorHandler.push(error);

                    callback(error, null);
                }
            } else {
                var error = new Error('SQL error at login', err, 1);
                self.errorHandler.push(error);

                callback(error, null);
            }
        });
    }

    /**
     * Checks if an user is logged based on its connection token and returns the User object
     * @param {string} token The token related to the connexion.
     * @param {userCallback} callback The callback function taking the user as parameter.
     */
    checkToken(token, callback){
        var self = this;

        User.getUserByToken(token, function(err, user){
            if (err === null){
                if (user !== null){
                    callback(null, user);
                } else {
                    var error = new Error('Disconnected', 'La clef ne correspond à aucun utilisateur', 0);
                    self.errorHandler.push(error);

                    callback(error, null);
                }
            } else {
                var error = new Error('SQL error at checkToken', err, 1);
                self.errorHandler.push(error);

                callback(error, null);
            }
        });
    }

    /**
     * Tries to register a user with the given credentials
     * @param {string} login The wanted username
     * @param {string} password The wanted password
     * @param {userCallback} callback The callback function taking the user as parameter if it worked, null if there were errors.
     */
    register(login, password, callback){
        if (login && password && login.length > 2 && password.length > 3){
            var self = this;

            User.getUserByLogin(login, function(err, user){
                if (err === null){
                    if (user === null){
                        var hashed_password = this.passwordHash(login, password);

                        var new_user = User.getUser({ 'login': login, 'password': hashed_password });
        
                        new_user.commit();
                        callback(null, new_user);
                    } else {
                        var error = new Error('Form input error', 'Le nom de compte entré est déjà utilisé par un autre compte.', 0);
                        self.errorHandler.push(error);

                        callback(error, null);
                    }
                } else {
                    var error = new Error('SQL error at register', err, 1);
                    self.errorHandler.push(error);

                    callback(error, null);
                }
            });
        } else {
            var error = new Error('Form input error', 'Le nom de compte ou le mot de passe entré est trop court.', 0);
            this.errorHandler.push(error);

            callback(error, null);
        }
    }

    passwordHash(login, password){
        return md5(login + md5(password));
    }

    getPlayersByIDs(ids, callback){
        var self = this;
        var filtered_ids = ids.filter(id => !isNaN(id));

        User.getPlayersByIDs(filtered_ids, function(err, players){
            if (err === null){
                callback(null, players);
            } else {
                var error = new Error('SQL error at getPlayersByIDs', err, 1);
                self.errorHandler.push(error);

                callback(error, null);
            }
        });
    }
}

module.exports = new UserService();

/**
 * Callback function taking an User object as parameter.
 * @callback userCallback
 * @param {Error} error
 * @param {User} user 
 */