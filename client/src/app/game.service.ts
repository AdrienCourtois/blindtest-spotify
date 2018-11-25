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
import { ResponseUserArray } from './responses/response.user.array';

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
      if (typeof((JSON.parse(localStorage.currentGame) as Game).id) == "undefined")
        throw "NullPointerException";

      this.currentGame = Object.assign(new Game(), JSON.parse(localStorage.currentGame));
    } catch(e) { 
      var self = this;

      this.loadCurrentGame(function(game: Game){
        self.setCurrentGame(game);
        router.navigateByUrl('/');
      });
    }
  }

  inGame(): boolean{
    return this.currentGame !== null;
  }

  getCurrentGame(): Game{
    return this.currentGame;
  }

  setCurrentGame(game: Game): void{
    this.currentGame = game;
    localStorage.currentGame = JSON.stringify(game);
  }

  getPoints(callback): void {
    if (this.getCurrentGame() === null)
      return;
    
    var data = "token=" + this.userService.getToken() + "&game_id=" + this.getCurrentGame().id;

    this.http.post<ResponseNumber>(server_url + 'game/points', data, httpOptions)
      .subscribe(response => {
        response = Object.assign(new ResponseNumber(), response);

        if (response.isError()){
          console.log('Une erreur est survenue at getPoints :');
          console.log(response.error);

          localStorage.currentGame = null;
          this.currentGame = null;

          this.router.navigateByUrl('/');
        } else {
          callback(response.data);
        }
      });
  }

  startGame(callback): void {
    if (this.getCurrentGame() === null)
      return;
    
    var self = this;
    var data = "token=" + this.userService.getToken() + "&game_id=" + this.currentGame.id;

    this.http.post<ResponseGame>(server_url + "game/start", data, httpOptions)
      .subscribe(response => {
        response = Object.assign(new ResponseGame(), response);

        if (response.isError()){
          console.log('Une erreur est survenue at startGame :');
          console.log(response.error);
        } else {
          self.setCurrentGame(Object.assign(new Game(), response.data));

          callback(new Success());
        }
      });
  }

  getPlayers(callback): void {
    if (this.getCurrentGame() === null)
      return;
    
    var data = "token=" + this.userService.getToken() + "&game_id=" + this.currentGame.id;

    this.http.post<ResponseUserArray>(server_url + 'game/getPlayers', data, httpOptions)
      .subscribe(response => {
        response = new ResponseUserArray(response);

        if (response.isError()){
          console.log('Une erreur est survenue at getPlayers :');
          console.log(response.error);
        } else {
          callback(response.data);
        }
      });
  }

  loadCurrentGame(callback): void{
    var self = this;
    var data = "token=" + this.userService.getToken();

    this.http.post<ResponseGame>(server_url + 'game/get', data, httpOptions)
      .subscribe(response => {
        response = Object.assign(new ResponseGame(), response);

        if (response.isError()){
          console.log('Une erreur est survenue at loadCurrentGame :');
          console.log(response.error);

          localStorage.currentGame = null;
          this.currentGame = null;

          this.router.navigateByUrl('/');
        } else {
          self.setCurrentGame(Object.assign(new Game(), response.data));

          callback(Object.assign(new Game(), response.data));
        }
      });
  }

  getAllAvailableGames(callback): void{
    var data = "token=" + this.userService.getToken();

    this.http.post<ResponseGameArray>(server_url + 'game/all', data, httpOptions)
      .subscribe(response => {
        response = Object.assign(new ResponseGameArray(), response);

        if (response.isError()){
          console.log('Une erreur est survenue at getAllAvailableGames : ');
          console.log(response.error);
        } else {
          callback(response.data);
        }
      });
  }

  joinGame(game: Game, callback): void{
    var self = this;
    var data = "token=" + this.userService.getToken() + "&game_id=" + game.id;

    this.http.post<ResponseGame>(server_url + 'game/join', data, httpOptions)
      .subscribe(response => {
        response = Object.assign(new ResponseGame(), response);

        if (response.isError()){
          console.log('Une erreur est survenue at joinGame :');
          console.log(response.error);
        } else {
          self.setCurrentGame(Object.assign(new Game(), response.data));
          
          callback(new Success());
        }
      });
  }

  leaveGame(game: Game, callback): void {
    var self = this;
    var data = "token=" + this.userService.getToken() + "&game_id=" + game.id;

    this.http.post<ResponseGame>(server_url + 'game/leave', data, httpOptions)
      .subscribe(response => {
        response = Object.assign(new ResponseGame(), response);

        if (response.isError()){
          console.log('Une erreur est survenue at leaveGame :');
          console.log(response.error);

          localStorage.currentGame = null;
          this.currentGame = null;

          this.router.navigateByUrl('/');
        } else {
          self.setCurrentGame(Object.assign(new Game(), response.data));

          callback(new Success());
        }
      });
  }

  createGame(name: string, theme: Theme, max_round: number, callback){
    var data = "token=" + this.userService.getToken() + "&name=" + name + "&theme_id=" + theme.id + "&max_round=" + max_round;
    
    this.http.post<ResponseGame>(server_url + 'game/create', data, httpOptions)
      .subscribe(response => {
        response = Object.assign(new ResponseGame(), response);

        if (response.isError()){
          console.log('Une erreur est survenue at createGame :');
          console.log(response.error);
        } else {
          callback(response.data);
        }
      });
  }
}
