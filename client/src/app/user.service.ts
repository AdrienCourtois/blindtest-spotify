import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from './objects/user';
import { ResponseUser } from './responses/response.user';
import { Router } from '@angular/router';
import { Success } from './responses/success';

const server_url = 'http://localhost:5000/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User = null;

  constructor(private http: HttpClient, private router: Router) {
    try{
      this.user = Object.assign(new User, JSON.parse(localStorage.user));
    } catch(e){ }
  }

  login(login: string, password: string, callback): void{
    var data = "login=" + login + "&password=" + password;

    this.http.post<ResponseUser>(server_url + 'user/login', data, httpOptions)
      .subscribe(response => {
        response = Object.assign(new ResponseUser(), response);

        if (response.isError()){
          callback(response.data);
        } else {
          callback(new Success());

          this.setUser(response.data);
          this.router.navigateByUrl[''];
        }
      });
  }

  setUser(user: User){
    this.user = user;
    localStorage.user = JSON.stringify(user);
  }

  isLogged(): boolean {
    return this.user !== null;
  }

  getToken(): string{
    if (this.isLogged())
      return this.user.token;
    return null;
  }
}
