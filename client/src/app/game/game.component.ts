import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Game } from '../objects/game';
import { Success } from '../responses/success';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { User } from '../objects/user';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  points: number = 0;
  players: User[] = null;
  playerRefresher: any;

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit() {
    this.refreshPoints();

    var self = this;
    this.playerRefresher = setInterval(function(){ self.refreshPlayers(); }, 1000);
  }

  get game() {
    return this.gameService.getCurrentGame();
  }

  startGame(): void {
    var self = this;

    this.gameService.startGame(function(status){
      if (status instanceof Success){
        clearInterval(self.playerRefresher);
      }
    });
  }

  refreshPoints(){
    var self = this;

    this.gameService.getPoints(function(points: number){
      self.points = points;
    });
  }

  leaveGame(){
    var self = this;

    this.gameService.leaveGame(this.game, function(status){
      if (status instanceof Success)
        self.router.navigateByUrl('/choose-game');
    });
  }

  refreshPlayers(): void{
    if (!this.game.hasStarted()){
      var self = this;

      this.gameService.getPlayers(function(players){
        self.players = players;
      });
    } else {
      clearInterval(this.playerRefresher);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.playerRefresher);
  }
}
