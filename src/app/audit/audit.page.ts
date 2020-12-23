import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import {AuditService} from '../services/data/audit.service';
import {HTTP} from '@ionic-native/http/ngx';
import { AuthService} from '../services/auth/auth.service';

interface Audit {
  attachment: string,
  companyId: number,
  createdBy: number,
  createdOn: string,
  data: string,
  dataArr: string,
  kind: number,
  quarter: number,
  status: number,
  updatedBy: number,
  updatedOn: string,
  uuid: string,
  workflow: string,
  year: number
}
@Component({
  selector: 'app-audit',
  templateUrl: './audit.page.html',
  styleUrls: ['./audit.page.scss'],
})
export class AuditPage implements OnInit {
  authEmail = '';
  public CompArrs = [];
  public CompArrsKt = [];
  url = environment.url_search;
  urldoc = environment.urldocument;
  sideMenu;
  list;
  filteredCompArrs = [];
  constructor(
      private route: ActivatedRoute,
      private navCtrl: NavController,
      private http: HttpClient,
      private router: Router,
      private auditData : AuditService,
      private HTTP: HTTP,
      private authData : AuthService
  ) { }

  ngOnInit() {
    this.getHTTP();
   // this.authEmail = this.route.snapshot.data['authEmail'];
   // console.log('authemail',this.route.snapshot.data['authEmail']);
  }
  gotoBack() {
    this.navCtrl.back();

  }
  openDetail(audit,officers){
    console.log('officers',officers);
    this.authEmail = this.route.snapshot.data['authEmail'];
    //console.log('authemail',this.route.snapshot.data['authEmail']);
    var fileString = environment.coreFileUpload.concat(audit.uuid);
    this.HTTP.get(fileString, {}, {
      'Content-Type': 'application/json'
    })
        .then(res => {
              var a = res.data;
              a = JSON.parse(a);
              var imgUrl = environment.upload;
              var fileArrs = [];
              a.forEach((e)=>{
                var data = JSON.parse(e.data);
                var path = imgUrl.concat(data.path);
                path = path.concat('/');
                var file = {
                  uuid : e.modelUuid,
                  uuid_img : e.uuid,
                  name : data.name,
                  path : path.concat(data.name),
                  typeProblem : data.typeProblem
                } ;
                fileArrs.push(file);
              });
              this.auditData.setFile(audit.uuid, fileArrs);
            }
        );
    this.auditData.setAudit(audit);
    let navigationExtras: NavigationExtras = {
      state: {
        audit: audit
      }
    };
    this.router.navigate(['audit-detail'],navigationExtras);
  }
  getHTTP() {
    this.http.get<[Audit]>( environment.apiAudit).subscribe(res => {
      res.forEach(e => {
        if (e.kind == 1) {
          var temp = e;
          temp.data = JSON.parse(e.data);
          this.CompArrs.push(temp);
        }
      });
      if(this.CompArrs.length){
        var filterComps = this.CompArrs.filter(function (e) {
          return e.data.checkList.length > 0;
        });
        this.CompArrs = filterComps;
        this.filteredCompArrs = this.CompArrs.sort(function (a,b) {
          return parseInt(a.data.dotKT)-parseInt(b.data.dotKT);
        });
        this.filteredCompArrs.reverse();
        console.log('this.filteredCompArrs',this.filteredCompArrs)
      }
    });
  }
}
