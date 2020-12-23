import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import { AuditService} from '../../services/data/audit.service';

@Component({
  selector: 'app-audit-image-zoom',
  templateUrl: './audit-image-zoom.component.html',
  styleUrls: ['./audit-image-zoom.component.scss'],
})
export class AuditImageZoomComponent implements OnInit {
  @ViewChild('slider', {read: ElementRef}) slider: ElementRef;
  filesArr;
  index;
  sliderOpts: any;
  nd;

  constructor(
      private modalCtrl: ModalController,
      private navParams: NavParams,
      private http: HttpClient,
      private alertCtrl: AlertController,
      private dataService: AuditService,

  ) {
    this.sliderOpts = {
      initialSlide: this.navParams.get('index'),
      // initialSlide: this.index, // index image
      //effect:	'cube',
      spaceBetween: 10,
      zoom: {
        maxRatio: 5
      }
    };
  }

  zoom(zoomIn: boolean) {
    console.log('call zoom function');
    let zoom = this.slider.nativeElement.swiper.zoom;

    if (zoomIn) {
      zoom.in();
    } else {
      zoom.out();
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');

  }

  close() {
    this.modalCtrl.dismiss();
  }

  onDelete(uuid, index) {
    var url = 'http://222.255.252.41/api/CoreFileUploads/'.concat(uuid);
    this.http.delete(url).subscribe(res => {
      var temp = JSON.parse(JSON.stringify(res));
      console.log(temp.uuid);
      // this.filesArr.splice(index, 1);
      this.dataService.deleteFile(temp.uuid);
      this.onCancel();
      // this.filesArr
    });
  }

  async presentAlert(uuid, index) {
    const alert = await this.alertCtrl.create({
      header: 'Cảnh báo',
      subHeader: '',
      message: 'Bạn muốn xoá ?',
      buttons: [{
        text: 'Không xoá',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
        {
          text: 'Xoá',
          handler: () => {
            this.onDelete(uuid, index);
            // console.log('delete clicked');
          }
        }]
    });

    await alert.present();
  } ;

  ngOnInit() {
    console.log('files', this.filesArr);
  }

}

