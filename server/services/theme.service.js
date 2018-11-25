const Theme = require('../objects/theme');
const Error = require('./error');

class ThemeService{
    constructor(){
        this.errorHandler = [];
    }

    getThemeByID(theme_id, callback){
        var self = this;

        Theme.getThemeByID(theme_id, function(err, theme){
            if (err === null){
                if (theme !== null){
                    callback(null, theme);
                } else {
                    var error = new Error('Structural error in getThemeByID', 'Il n\'y a aucun thème qui correspond à l\'ID passée', 0);
                    self.errorHandler.push(error);

                    callback(error, null);
                }
            } else {
                var error = new Error('SQL error in getThemeByID', err, 1);
                self.errorHandler.push(error);

                callback(error, null);
            }
        });
    }

    getAllThemes(callback){
        var self = this;

        Theme.getAllThemes(function(err, themes){
            if (err === null){
                callback(null, themes);
            } else {
                var error = new Error('SQL error in getAllThemes', err, 1);
                self.errorHandler.push(error);

                callback(error, null);
            }
        });  
    }
}

module.exports = new ThemeService();