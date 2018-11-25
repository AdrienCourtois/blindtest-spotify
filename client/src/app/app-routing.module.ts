import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { AppComponent } from './app.component';
import { GameChoiceComponent } from './game-choice/game-choice.component';
import { GameGuard } from './auth/game.guard';
import { GameComponent } from './game/game.component';

const routes = [
  { path: '', component: GameComponent, data: { requiresLogin: true, requiresGame: true }, canActivate: [ AuthGuard, GameGuard ] },
  { path: 'choose-game', component: GameChoiceComponent, data: { requiresLogin: true }, canActivate: [ AuthGuard ] },
  { path: 'login', component: LoginComponent, data: { requiresLogin: false } }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }