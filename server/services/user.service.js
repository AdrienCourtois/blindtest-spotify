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
                    if (user.password == hashed_password)
                        callback(null, user);
                    else {
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
     * Tries to register a user with the given credentials
     * @param {string} login The wanted username
     * @param {string} password The wanted password
     * @param {userCallback} callback The callback function taking the user as parameter if it worked, null if there were errors.
     */
    register(login, password, callback){
        if (login.length > 2 && password.length > 3){
            var hashed_password = this.passwordHash(login, password);

            var new_user = User.getUser({ 'login': login, 'password': hashed_password });

            new_user.commit();
            callback(null, new_user);
        } else {
            var error = new Error('Form input error', 'Le nom de compte ou le mot de passe entré est trop court.', 0);
            this.errorHandler.push(error);

            callback(error, null);
        }
    }

    passwordHash(login, password){
        return md5(login + md5(password));
    }
}

module.exports = new UserService();

/**
 * Callback function taking an User object as parameter.
 * @callback userCallback
 * @param {Error} error
 * @param {User} user 
 */