import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Game } from '../objects/game';
import { Success } from '../responses/success';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: Game = null;
  points: number = 0;

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit() {
    this.game = this.gameService.getCurrentGame();
    this.refreshPoints();
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
    }):
  }
}
