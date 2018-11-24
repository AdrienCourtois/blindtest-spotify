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

    addMusic(music_id){
        var musics = this.getMusics();
        musics.push(music_id);

        setMusic(musics);
    }
    
    commit(){
        if (this.id === null || isNaN(this.id) || this.id <= 0){
            // insert
        } else {
            // update
        }
    }
}

module.exports = Theme;