import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { User } from './user';
import { ResponseUser } from './responses/response.user';
import { Router } from '@angular/router';

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
      this.user = JSON.parse(localStorage.user) as User;
    } catch(e){ }
  }

  login(login: string, password: string, callback): void{
    var data = "login=" + login + "&password=" + password;

    this.http.post<ResponseUser>('http://localhost:5000/user/login', data, httpOptions)
      .subscribe(response => {
        response = new ResponseUser(response);

        if (response.isError()){
          callback(response.data);
        } else {
          callback('success');
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
    console.log(this.user);
    return this.user !== null;
  }

  getToken(): string{
    if (this.isLogged())
      return this.user.token;
    return null;
  }
}
