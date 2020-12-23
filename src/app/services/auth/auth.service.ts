// @ts-ignore
import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Storage} from '@ionic/storage';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
const headerDict = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

const httpOptions = {
    headers: new HttpHeaders(headerDict)
};
const TOKEN_KEY = 'access_token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
    redirectUrl: string;
   // authurl = environment.authUrl;
    url = '';
    user = null;
    authData = null;
    authEmail = '';
    authenticationState = new BehaviorSubject(false);

  constructor(
                private activatedRoute: ActivatedRoute,
                private router: Router,
              private http: HttpClient,
              private helper: JwtHelperService,
              private storage: Storage,
               private plt: Platform,
              private alertController: AlertController
  )
  {
      this.plt.ready().then(() => {
          this.checkToken();
      });
  }
  getAuthEmail(){
      return this.authData.email;
  }
    checkToken() {
        this.storage.get(TOKEN_KEY).then(token => {
            if (token)
            {
                const decoded = this.helper.decodeToken(token);
                const isExpired = this.helper.isTokenExpired(token);
                if (!isExpired) {
                    this.user = decoded;
                    this.authenticationState.next(true);
                } else {
                    this.storage.remove(TOKEN_KEY);
                }
            }
        });

    }
    register(credentials) {
        return this.http.post(`${this.url}/api/register`, credentials).pipe(
            catchError(e => {
                throw new Error(e);
            })
        );
    }
    login(credentials) {
         return this.http.post('http://222.255.252.41/api/Auth/Login', credentials,{ responseType: 'text' })
             .pipe(
                 tap(res => {
                     console.log('res',res);
                     this.storage.set(TOKEN_KEY, res);
                     this.storage.get(TOKEN_KEY).then((val) => {
                         console.log('TOKEN_KEY from storage', val);
                     });
                     this.authData = this.helper.decodeToken(res);
                     var temp =  JSON.parse(this.authData.sub);
                     var obj = {
                                 email : this.authData.email,
                                 roles : temp.roles
                                 };

                     // save authData to service
                     console.log('decode',obj);
                     this.authenticationState.next(true);
                     this.redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');
                     if(this.redirectUrl){
                         this.router.navigateByUrl(this.redirectUrl);
                     }else{
                         this.router.navigateByUrl('main');
                     }

                 }),
                 catchError(e => {
                     console.log(e);
                     this.showAlert(e.error.msg);
                     throw new Error(e);
                 })
             );
    }
    logout() {
        this.storage.remove(TOKEN_KEY).then(() => {
            this.authenticationState.next(false);
        });
    }

    getSpecialData() {
        return this.http.get(`${this.url}/api/special`).pipe(
            catchError(e => {
                let status = e.status;
                if (status === 401) {
                   // this.showAlert('You are not authorized for this!');
                    this.logout();
                }
                throw new Error(e);
            })
        )
    }
    isAuthenticated() {
        return this.authenticationState.value;
    }
    showAlert(msg) {
        const alert = this.alertController.create({
           // message: msg,
            header: 'Đăng nhập tài khoản hoặật khẩu bị sai',
            buttons: ['OK']
        });
        alert.then(alert => alert.present());
    }
    showToken(msg) {
        let alert = this.alertController.create({
            message: msg,
        });
        alert.then(alert => alert.present());
    }
}
