import { Component, OnInit } from '@angular/core';
import {Platform, ToastController, LoadingController,ModalController} from '@ionic/angular';
import {File} from '@ionic-native/file/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {HTTP} from '@ionic-native/http/ngx';
import {AuditService} from '../../services/data/audit.service';
import {DocumentViewer} from '@ionic-native/document-viewer/ngx';

@Component({
  selector: 'app-keywords-category',
  templateUrl: './keywords-category.component.html',
  styleUrls: ['./keywords-category.component.scss'],
})
export class KeywordsCategoryComponent implements OnInit {
  private loading;
  constructor(private modalCtrl : ModalController,
              private loadingCtrl : LoadingController,
              private toastController: ToastController,
              private file : File,
              private ft : FileTransfer,
              private fileOpener : FileOpener,
              private HTTP :HTTP,
              private dataService: AuditService,
              private platform : Platform,
              private document : DocumentViewer,

  ) { }
  data : any;
  ngOnInit() {}
  ionViewWillEnter() {
   console.log('data', this.data);


  }
  onCancel(){
    this.modalCtrl.dismiss(null,'cancel');
  }
  viewDoc(uuid,page){
    console.log('page',page);
    this.loadingCtrl.create({
      message : "Loading..."
    }).then((overlay)=>{
      this.loading = overlay;
      this.loading.present();
    });
    console.log('path',this.file.dataDirectory);
    var url = 'http://222.255.252.41/api/CoreFileUploads1/'.concat(uuid);
    var urlDoc = 'http://222.255.252.41/content/uploads/';
    this.HTTP.get(url,{},{
      'Content-Type' : 'application/json'
    }).then(
        res =>{
          var tempRes = JSON.parse(res.data);
          var tempo = JSON.parse(tempRes[0].data);
          console.log('tempo',tempRes[0].data);
          if(tempo.ext == 'pdf'|| tempo.type == 'application/pdf'){
            tempo.path = tempo.path.replace(/\\/g, '/');
            var link = tempo.path.concat(tempo.name);
            urlDoc = urlDoc.concat(link);
            console.log('url',urlDoc);
            urlDoc = this.replaceText(urlDoc);
            //  this.loading.dismiss();
            let path = this.file.dataDirectory + 'uuid.pdf';
            const transfer = this.ft.create();
            this.dataService.setDocument(uuid,'',page);
            //`${path}
            //  let path2 = path + uuid + ".pdf";
            /* if(this.platform.is('ios')){
               this.loading.dismiss();
               this.modalController.create({
                 component: DocumentDetailComponent,
                 backdropDismiss: false,
                 componentProps: {
                   src: urlDoc,
                   page : page
                 }
               }).then(modal => {
                 modal.present();
               });



             }else{
               this.fileOpener.open(url, 'application/pdf');
             }*/
            // doc bang viewDocument
            // transfer.download(urlDoc,path + uuid + ".pdf").then(entry =>{
            // this.loading.dismiss();

            transfer.download(urlDoc,path).then(entry =>{
              let url = entry.toURL();
              if(this.platform.is('ios')){
                this.loading.dismiss();
                this.document.viewDocument(url,'application/pdf',{},this.onShow,this.onClose,this.onMissingApp,this.onError);

              } else{
                this.loading.dismiss();
                this.fileOpener.open(url, 'application/pdf');
              }
            }).catch(err =>{
              console.log('err ft',err);
            })
          }
          else{
            this.loading.dismiss();
            this.presentToast('Chưa hỗ trợ đọc file này !!!');

            console.log('not pdf type');// file ko phai pdf su ly sau
          }

        }
    )
        .catch(err => console.log(err))
  }
  replaceText(text){
    return text.trim().split(' ').join('%20')
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
  onShow(){
    console.log('onShow');
  }
  onMissingApp(){

  }
  onClose(){
    console.log('onClose');
    window.console.log('document closed');
    //e.g. remove temp files
  }
  onError(){
    console.log('errrrrr');
  }
}
