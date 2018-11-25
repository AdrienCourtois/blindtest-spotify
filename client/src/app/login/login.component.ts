import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { UserService } from '../user.service';
import { Success } from '../responses/success';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: string = '';
  password: string = '';

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, 
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.minLength(2)],
      password: ['', Validators.minLength(2)]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid)
      return;

    var login = this.loginForm.controls.login.value;
    var password = this.loginForm.controls.password.value;

    this.userService.login(login, password, function(status){
      if (status instanceof Success)
        this.router.navigateByUrl('/');
    });
  }

}
