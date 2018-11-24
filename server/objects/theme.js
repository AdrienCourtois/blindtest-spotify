const pool = require('./sql').getPool();

class Theme{
    constructor(id, name, musics){
        this.id = id;
        this.name = name;
        this.musics = musics;
    }

    getMusics(){
        return this.musics.split(',').map(item => parseInt(item));
    }

    setMusics(musics){
        this.musics = musics.join(',');
    }
    
    commit(){
        if (this.id === null || isNaN(this.id) || this.id <= 0){
            var self = this;

            pool.query("INSERT INTO themes (name) VALUES (?)", [this.name], function(err, quer){
                self.id = quer.insertId;
            });
        } else {
            pool.query("UPDATE themes SET name = ?, musics = ? WHERE id = ?", [this.name, this.musics, this.id]);
        }
    }

    static getTheme(obj){
        return new Theme(obj.id, obj.name, obj.musics);
    }

    static getThemeByID(theme_id, callback){
        pool.query("SELECT * FROM themes WHERE id = ?", [theme_id], function(err, quer){
            if (err === null){
                if (quer.length == 1){
                    callback(null, Theme.getTheme(quer[0]));
                } else {
                    callback(null, null);
                }
            } else {
                callback(err, null);
            }
        });
    }
}

module.exports = Theme;