import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, RouterEvent, ActivatedRoute } from '@angular/router';
// @ts-ignore
import { CategoryDataService} from './services/data/category-data.service';
import { ListDataService} from './services/data/list-data.service';
import { DocumentDataService} from './services/data/document-data.service';
import { HttpClient } from '@angular/common/http';
import { AuthService} from './services/auth/auth.service';
// @ts-ignore
import { environment } from '../environments/environment';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  authenticationState = new BehaviorSubject(false);
  selectedPath = '';
  public selectedIndex = 0;
  url = environment.url;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private categoryData : CategoryDataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private listData : ListDataService,
    private documentData : DocumentDataService,
    private auth : AuthService
  ) {

    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  search() {
    this.router.navigate(['main']);

  }
  document(){
    this.router.navigate(['keywords-home']);

  }
  login() {
        this.router.navigate(['login']);

    }

  logOut(){
    this.auth.logout();
    this.router.navigate(['login']);
    /* await this.auth.signoutUser()
     .then(() => {
       if(){
         console.log("----- 1")
      //   this.ionicComponentService.presentToast("logged out",3000);
         //this.ionicComponentService.dismissLoading();
       //  this.router.navigateByUrl('/'+this.redirectUrl);

       }else{
         console.log("----- 2")
       //  this.ionicComponentService.presentToast("logged out",3000);
         //this.ionicComponentService.dismissLoading();
         this.router.navigateByUrl('/profile');

       }

     }, (error) => {
       var errorMessage: string = error.message;
       console.log("ERROR:"+errorMessage);
     //  this.ionicComponentService.presentToast(errorMessage,3000);
      // this.ionicComponentService.dismissLoading();

    // });


    }*/
  }
  ngOnInit() {
    /*const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }*/

  }

}
