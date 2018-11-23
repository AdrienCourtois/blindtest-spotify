/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';
import AlbumCover from './AlbumCover';

const apiToken = 'BQDktt-peWouaGM9TKDdCtd9jG848edCnunzoYQxgw7nZHPW_Hqbm-MZc_GKggdLqwAE4bHW6iDgA_GLidgKjIeCvzhNYDOQOnckgfdq2xcm59wOZ8Gpqbj8dzzKdIf8s2wHXiNCgV6cfid2FcbE-CeBMg';
const timeoutDuration = 30000;

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      text: '',
      tracks: null,
      currentID: 0,
      timeout: null,
      points: 0
    };
  }

  componentDidMount(){
    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
      Authorization: 'Bearer ' + apiToken,
      },
    })
      .then(response => response.json())
      .then((data) => {
        var self = this;

        this.setState({
          songLoaded: true,
          tracks: data.items,
          currentID: getRandomNumber(data.items.length),
          timeout: setTimeout(function(){ self.newStep() }, timeoutDuration)
        });
      });
  }

  checkAnswer(id){
    var self = this;

    if (id === this.state.currentID){
      clearTimeout(this.state.timeout);
      swal('Bravo', 'Vous avez trouvé la bonne chanson !', 'success').then(function(){ self.newStep(true) });
    } else
      swal('Erreur', 'Vous n\'avez pas trouvé la bonne chanson !', 'error').then(function(){ self.newStep() });
  }

  newStep(won = false){
    var self = this;
    
    this.setState({
      currentID: getRandomNumber(this.state.tracks.length),
      timeout: setTimeout(function(){ self.newStep() }, timeoutDuration),
      points: this.state.points + ((won) ? 1 : 0)
    });
  }

  render() {
    if (!this.state.songLoaded){
      return (
        <div className="App">
          <img src={loading} alt="Chargement en cours..." />
        </div>
      );
    } else {
      var r1 = getRandomNumber(this.state.tracks.length), 
          r2 = getRandomNumber(this.state.tracks.length);
      
      var firstTrack  = [this.state.currentID, this.state.tracks[this.state.currentID]],
          secondTrack = [r1, this.state.tracks[r1]],
          thirdTrack  = [r2, this.state.tracks[r2]];

      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">Bienvenue sur le Blindtest</h1>
          </header>
          <div className="App-images">
            <p>Vous avez {this.state.points} points</p>
            <AlbumCover track={this.state.tracks[this.state.currentID].track.album.images[0].url} />
          </div>
          <div className="App-buttons">
          {
            shuffleArray([firstTrack, secondTrack, thirdTrack]).map(item => {
              return (<Button onClick={() => this.checkAnswer(item[0])}>{item[1].track.name}</Button>)
            })
          }
          </div>

          <Sound url={this.state.tracks[this.state.currentID].track.preview_url} playStatus={Sound.status.PLAYING}/>
        </div>
      );
    }
  }
}

export default App;
