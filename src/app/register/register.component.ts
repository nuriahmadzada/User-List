import { Component, OnInit } from '@angular/core';
import {FormGroup,Validators,FormControl} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { first } from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  returnUrl: string;
  errorMsg: string = "";
  loginUser: any;
  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService
  ) {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  get f() {
    return this.registerForm.controls;
  }

  initLoginForm() {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100),
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])
    });

    // this.loginForm.patchValue({
    //   email: "eve.holt@reqres.in",
    //   password: "cityslicka"
    // })
  }

  register() {
    this.submitted = true;
    this.errorMsg = "";
    // stop here if form is invalid
    if (this.registerForm.valid) {
      this.loginUser = Object.assign({}, this.registerForm.value);
      this.authenticationService
        .register(this.loginUser.email, this.loginUser.password)
        .pipe(first())
        .subscribe(
          data => {
            this.loading = false;
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.loading = false;
            this.submitted = false;
            if (error.status == 401 || error.status == 404 || error.status == 400) {
              this.errorMsg = "Email or password is Incorrect";
            }
            
          },
          () => {
            this.loading = false;
            
          }
        );
    }
  }

  ngOnInit() {
    this.initLoginForm();
    localStorage.clear();
    this.authenticationService.currentUserSubject.next(null);
  }
}
