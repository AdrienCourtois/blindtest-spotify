import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Game } from '../objects/game';
import { Router } from '@angular/router';
import { Success } from '../responses/success';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThemeService } from '../theme.service';
import { Theme } from '../objects/theme';

@Component({
  selector: 'app-game-choice',
  templateUrl: './game-choice.component.html',
  styleUrls: ['./game-choice.component.css']
})
export class GameChoiceComponent implements OnInit {
  games: Game[];
  creatingGame: boolean = false;
  createGameForm: FormGroup;
  themes: Theme[];

  constructor(private formBuilder: FormBuilder, 
              private gameService: GameService,
              private themeService: ThemeService,
              private router: Router) {
    if (this.gameService.inGame())
      this.router.navigateByUrl('/');
  }

  ngOnInit() {
    var self = this;

    this.gameService.getAllAvailableGames(function(games){
      self.games = games;
    });
  }

  chooseGame(game: Game): void{
    var self = this;

    this.gameService.joinGame(game, function(status){
      if (status instanceof Success)
        self.router.navigateByUrl('/');
    });
  }

  showCreateGame(){
    this.creatingGame = true;
    var self = this;

    this.themeService.getAllThemes(function(themes: Theme[]){
      var min_id = Math.min.apply(null, themes.map(theme => theme.id));
      var max_id = Math.max.apply(null, themes.map(theme => theme.id));

      self.themes = themes;

      self.createGameForm = self.formBuilder.group({
        name: ['', Validators.minLength(2)],
        theme: [self.themes[0], [Validators.max(max_id), Validators.min(min_id)]]
      });
    });
  }

  createGame(){
    if (this.createGameForm.invalid)
      return;

    var name = this.createGameForm.controls.name.value;
    var theme = this.createGameForm.controls.theme.value;

    var self = this;

    this.gameService.createGame(name, theme, function(game: Game){
      if (game !== null){
        self.games.push(game);
        self.creatingGame = false;
      }
    });
  }
}
