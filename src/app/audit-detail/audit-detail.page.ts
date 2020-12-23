import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import { ActivatedRoute, Router ,NavigationExtras} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import{AuditService} from '../services/data/audit.service';

@Component({
  selector: 'app-audit-detail',
  templateUrl: './audit-detail.page.html',
  styleUrls: ['./audit-detail.page.scss'],
})
export class AuditDetailPage implements OnInit {
  data: any;
  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private navCtrl : NavController,
              private formBuilder: FormBuilder,
              private auditData: AuditService
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.audit;
        console.log('data',this.data);
      }
    });
  }
  ngOnInit() { }
  gotoBack() {
    this.navCtrl.back();

  }

  onOpenModal(problem,lv,lvId){
    let navigationExtras: NavigationExtras = {
      state: {
        problem: problem
      }
    };
    this.auditData.setAuditLv({title : lv, id : lvId});
    this.router.navigate(['problem-detail'],navigationExtras);

  }
}
