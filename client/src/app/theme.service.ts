import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Theme } from './objects/theme';
import { UserService } from './user.service';
import { ResponseThemeArray } from './responses/response.theme.array';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};
const server_url = 'http://localhost:5000/';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private http: HttpClient, private userService: UserService) { }

  getAllThemes(callback){
    var data = "token=" + this.userService.getToken();

    this.http.post<ResponseThemeArray>(server_url + 'theme/all', data, httpOptions)
      .subscribe(response => {
        response = Object.assign(new ResponseThemeArray(), response);

        if (response.isError()){
          console.log('Une erreur est survenue :');
          console.log(response.error);
        } else {
          callback(response.data);
        }
      });
  }
}
