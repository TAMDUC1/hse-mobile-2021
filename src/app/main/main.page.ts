import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import {NavigationExtras, Router} from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ListDataService} from '../services/data/list-data.service';
import {DocumentDataService} from '../services/data/document-data.service';
import {CategoryDataService} from '../services/data/category-data.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  key_search:string = "";
  loading;
  url = environment.url_search;
  urldoc = environment.urldocument;
  sideMenu;
  list;
    constructor(
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private router: Router,
    public toastController: ToastController,
    public listData: ListDataService,
    private documentData : DocumentDataService,
    private categoryData : CategoryDataService,
  ) { 
  }

  ngOnInit() {
  }
  async seach_text() {
    /* 
    *  Process search by key and navigation to list page
    */
    console.log('vao ham')
    await this.loadingCtrl.create({
      message: "Loading...",
      duration: 2000
    }).then((overlay) => {
      this.loading = overlay;
      this.loading.present();
    });
    let url = this.url + this.key_search; // sau nay dung link nay
    var data: any = []
    this.http.get(url).subscribe((response) => {
        this.listData.setData('0',response,'');
        data = response;
      this.loading.dismiss();
      if (data.length == 0) {
        this.presentToast(`Không có kết qủa tìm kiếm`)
      }
      else {
          this.key_search="";
          this.router.navigateByUrl('/' + 'list' + '/' + '0');
      }
    }, er => {
      this.loading.dismiss();
    });
  }
    viewData(id) {

        this.http.get(this.urldoc + id).subscribe((response) => {
            this.documentData.setData(id,response);

            if(response){
                this.router.navigateByUrl('/' + 'document' + '/' + id);
            }
        });

    }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }
    openItemDetail(url, ObjectID) {
        var temp = url.toLowerCase();
        if (temp === 'detail') {
            temp = 'document';
        }
        // call api get category de truyen vao page temp
        if (temp === 'document') {
            this.http.get(environment.urldocumentmother).subscribe((response) => {
                this.documentData.setData(ObjectID,response);
                this.router.navigateByUrl('/' + 'document' + '/' + ObjectID);
            });
        } else {
            if (temp == 'list') {
                let urlTemp = environment.urllist + ObjectID + '&Page=1&RowPage=10&P_Search=';
                console.log('urlTemp', urlTemp);
                this.http.get(urlTemp).subscribe((response) => {
                    this.listData.setData(ObjectID,response,'');
                    this.router.navigateByUrl('/' + temp + '/' + ObjectID);
                });
            } else {
                let urlTemp = environment.url + ObjectID;
                this.http.get(urlTemp).subscribe((response) => {
                    this.categoryData.setData(ObjectID,response);
                    this.router.navigateByUrl('/' + temp + '/' + ObjectID);
                });
            }
        }
    }
    openAuditsList(){
        this.router.navigateByUrl('audit' );

        // chuyen qua trang danh sach audits

    }


}
