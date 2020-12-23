import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthService} from '../services/auth/auth.service';
import {MenuController} from '@ionic/angular';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialsForm: FormGroup;

  constructor(
      private router: Router,
      private formBuilder: FormBuilder,
      public menuCtrl: MenuController,
      private authService: AuthService
  ) { }

    ngOnInit() {
        this.credentialsForm = this.formBuilder.group({
            Username: ['', [Validators.required, Validators.email]],
            PasswordMobile: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
    onSubmit() {
        this.authService.login(this.credentialsForm.value).subscribe();
    }
    toggleSideMenu() {
        this.menuCtrl.toggle(); //Add this method to your button click function
    }
    register() {
        this.authService.register(this.credentialsForm.value).subscribe(res => {
            this.authService.login(this.credentialsForm.value).subscribe();
        });
    }
    logOut(){
        this.authService.logout();
    }

}
