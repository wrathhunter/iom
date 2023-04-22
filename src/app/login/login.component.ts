import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  uloginForm!: FormGroup;
  errorMessage!: string;
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const username = this.loginForm?.value.username;
    const password = this.loginForm?.value.password;
    this.authService.login(username, password)
      .subscribe(
        data => {
          console.log(data)
          localStorage.setItem('userId',data.user._id)
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error(error);
          this.errorMessage = 'Failed to login. Please try again.';
        }
      );
  }

}
