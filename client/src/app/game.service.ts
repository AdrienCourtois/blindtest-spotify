import { Injectable } from '@angular/core';

import { Game } from './objects/game';
import { ResponseGameArray } from './responses/response.game.array';
import { ResponseGame } from './responses/response.game';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { ResponseNumber } from './responses/response.number';
import { Success } from './responses/success';
import { Theme } from './objects/theme';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};
const server_url = 'http://localhost:5000/';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  currentGame: Game = null;

  constructor(private http: HttpClient, private userService: UserService, private router: Router) { 
    try{
      this.currentGame = JSON.parse(localStorage.currentGame) as Game;
    } catch(e) { 
      this.loadCurrentGame(function(game: Game){
        this.currentGame = game;
      });
    }
  }

  inGame(): boolean{
    console.log(this.currentGame)
    return this.currentGame !== null;
  }

  getCurrentGame(): Game{
    return this.currentGame;
  }

  getPoints(callback): void {
    var data = "token=" + this.userService.getToken() + "&game_id=" + this.currentGame.id;

    this.http.post<ResponseNumber>(server_url + 'game/points', data, httpOptions)
      .subscribe(response => {
        response = new ResponseNumber(response);

        if (response.isError()){
          console.log('Une erreur est survenue :');
          console.log(response.error);

          localStorage.currentGame = null;
          this.currentGame = null;

          this.router.navigateByUrl('/');
        } else {
          callback(response.data);
        }
      });
  }

  loadCurrentGame(callback): void{
    var data = "token=" + this.userService.getToken();

    this.http.post<ResponseGame>(server_url + 'game/get', data, httpOptions)
      .subscribe(response => {
        response = new ResponseGame(response);

        if (response.isError()){
          console.log('Une erreur est survenue :');
          console.log(response.error);

          localStorage.currentGame = null;
          this.currentGame = null;

          this.router.navigateByUrl('/');
        } else {
          localStorage.currentGame = JSON.stringify(response.data);
          callback(response.data);
        }
      });
  }

  getAllAvailableGames(callback): void{
    var data = "token=" + this.userService.getToken();

    this.http.post<ResponseGameArray>(server_url + 'game/all', data, httpOptions)
      .subscribe(response => {
        response = new ResponseGameArray(response);

        if (response.isError()){
          console.log('Une erreur est survenue : ');
          console.log(response.error);
        } else {
          callback(response.data);
        }
      });
  }

  joinGame(game: Game, callback): void{
    var data = "token=" + this.userService.getToken() + "&game_id=" + game.id;

    this.http.post<ResponseGame>(server_url + 'game/join', data, httpOptions)
      .subscribe(response => {
        response = new ResponseGame(response);

        if (response.isError()){
          console.log('Une erreur est survenue :');
          console.log(response.error);
        } else {
          localStorage.currentGame = JSON.stringify(response.data);
          this.currentGame = response.data;
          
          callback(new Success());
        }
      });
  }

  leaveGame(game: Game, callback): void {
    var data = "token=" + this.userService.getToken() + "&game_id=" + game.id;

    this.http.post<ResponseGame>(server_url + 'game/leave', data, httpOptions)
      .subscribe(response => {
        response = new ResponseGame(response);

        if (response.isError()){
          console.log('Une erreur est survenue');
          console.log(response.error);

          localStorage.currentGame = null;
          this.currentGame = null;

          this.router.navigateByUrl('/');
        } else {
          localStorage.currentGame = null;
          this.currentGame = null;

          callback(new Success());
        }
      });
  }

  createGame(name: string, theme: Theme, max_round: number, callback){
    var data = "token=" + this.userService.getToken() + "&name=" + name + "&theme_id=" + theme.id + "&max_round=" + max_round;
    
    this.http.post<ResponseGame>(server_url + 'game/create', data, httpOptions)
      .subscribe(response => {
        response = new ResponseGame(response);

        if (response.isError()){
          console.log('Une erreur est survenue');
          console.log(response.error);
        } else {
          callback(response.data);
        }
      });
  }
}
