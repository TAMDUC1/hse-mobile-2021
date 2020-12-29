import {ChangeDetectorRef, Component, Input, OnInit ,SimpleChanges, OnChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionSheetController,Platform, AlertController, LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';

import {AuditService} from '../services/data/audit.service';
import { environment } from '../../environments/environment';
import {HTTP} from '@ionic-native/http/ngx';
import {File, FileEntry} from '@ionic-native/File/ngx';
// @ts-ignore
import { MediaObject, Media } from '@ionic-native/media/ngx';
// @ts-ignore
import {StreamingMedia} from '@ionic-native/streaming-media/ngx';

// @ts-ignore
import { ImagePicker } from '@ionic-native/image-picker/ngx';
// @ts-ignore
import {CaptureError, MediaFile,MediaCapture} from '@ionic-native/media-capture/ngx';
// @ts-ignore
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
// @ts-ignore
import {getFileReader} from '../app.module';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {finalize, take} from 'rxjs/operators';
import {AuditImageZoomComponent} from './audit-image-zoom/audit-image-zoom.component';

const MEDIA_FOLDER_NAME = 'my_media';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};
@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.page.html',
  styleUrls: ['./problem-detail.page.scss'],
})
export class ProblemDetailPage implements OnInit {
   private editAble = false;
  files = [];
  filesArr = [];
  imageArr = [];
  problem: any;
  currentAudit: any;
  currentLv : any;
  currentFile = {
    path :'',
    name : ''
  };
  requestObject: any = null;
  private message: string;
  private authEmail;
  constructor(private route: ActivatedRoute,
              private plt: Platform,
              private router: Router,
              private alertCtrl: AlertController,
              private navCtrl : NavController,
              private auditData : AuditService,
              private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private HTTP: HTTP,
              private actionSheetController: ActionSheetController,
              private imagePicker: ImagePicker,
              private mediaCapture: MediaCapture,
              private file: File,
              private ref: ChangeDetectorRef,
              private media: Media,
              private streamingMedia: StreamingMedia,
              private photoViewer: PhotoViewer,
              private loadingController: LoadingController,
              private http: HttpClient,
              private toastController: ToastController,
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.problem = this.router.getCurrentNavigation().extras.state.problem;
      }
    });
  }
  reloadFile(){
    this.auditData.File.subscribe((file) => {
      this.filesArr = file.filter(e => e.typeProblem === this.problem.title.vi);
      console.log('this.fileArr', this.filesArr);
    });
    console.log('this.fileArr', this.filesArr);
  }
  ionViewWillEnter() {
    this.reloadFile();
  }
  ngOnInit() {
    this.plt.ready().then(() => {
      let path = this.file.dataDirectory;
      this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
          () => {
            this.loadFiles();
          },
          err => {
            this.file.createDir(path, MEDIA_FOLDER_NAME, false);
          }
      );
    });
    this.authEmail = this.route.snapshot.data['authEmail'];
    this.currentAudit = this.auditData.getAudit();
    if(this.currentAudit.data.officer){
      this.currentAudit.data.officer.forEach(e =>{
        if(e.email ===  this.authEmail || this.authEmail === 'admin@local'){
          this.editAble = true;
        }
      })
    }
    this.currentLv = this.auditData.getAuditLv();
  }
  gotoBack() {
    this.navCtrl.back();

  }
  save(){
    this.currentAudit.data.checkList.forEach(e =>{
      if(e.id == this.currentLv.id && e.title.vi == this.currentLv.title){
        this.loadingCtrl.create({
          keyboardClose: true,
          message: 'waiting ...'
        }).then(loadingEl => {
          loadingEl.present();
          var auditSingleUrl = environment.apiAudit.concat(this.currentAudit.uuid);
          return this.HTTP.get(auditSingleUrl, {}, {
            'Content-Type': 'application/json'
          })
              .then(res =>
              {
                this.requestObject = JSON.parse(res.data);
                this.requestObject.data = JSON.parse(this.requestObject.data);
                this.requestObject.data.checkList.forEach((e) => {
                  if(e.title.vi === this.currentLv.title){
                    e.children.forEach(el =>{
                      if(el.title.vi === this.problem.title.vi){
                        el.description = this.problem.description;
                        el.state = this.problem.state;
                      }
                    })
                  }
                });
                this.requestObject.data = JSON.stringify(this.requestObject.data);
                this.HTTP.setDataSerializer('json');
                this.HTTP.put(auditSingleUrl, this.requestObject,
                    {'Content-Type': 'application/json'})
                    .then(data => {
                          if (data.status == 200) {
                            setTimeout(() => {
                              loadingEl.dismiss();
                              this.presentAlert();
                            }, 500);
                          } else {
                            this.presentAlertFail();
                            loadingEl.dismiss();
                          }
                        }
                    )
                    .catch(err => console.log('day la loi', err));
              })
        });
      }
    });
  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Thông báo',
      subHeader: '',
      message: 'Update thành công !!!',
      buttons: ['OK']
    });

    await alert.present();
  } ;
  async presentAlertFail() {
    const alert = await this.alertCtrl.create({
      header: 'Thông báo',
      subHeader: '',
      message: ' Update thất bại!!!',
      buttons: ['OK']
    });
    await alert.present();
  } ;
  async selectMedia() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'What would you like to add?',
      buttons: [
        {
          text: 'Chụp Ảnh',
          handler: () => {
            this.captureImage();
          }
        },
        {
          text: 'Quay Phim',
          handler: () => {
            this.recordVideo();
          }
        },
        {
          text: 'Ghi Âm',
          handler: () => {
            this.recordAudio();
          }
        }/*,
                {
                    text: 'Load multiple',
                    handler: () => {
                        this.pickImages();
                    }
                }*/,
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
  pickImages() {
    this.imagePicker.getPictures({}).then(
        results => {
          console.log('results',results );

          for (var i = 0; i < results.length; i++) {
            this.copyFileToLocalDir(results[i]);
          }
        }
    );
    //console.log('this.imageArr uuuuu',this.imageArr);
    //  this.ref.detectChanges();
    // If you get problems on Android, try to ask for Permission first
    /*  this.imagePicker.requestReadPermission().then(result => {
        console.log('requestReadPermission: ', result);
        this.selectMultiple();
      });*/

  }
  captureImage() {
    this.mediaCapture.captureImage().then(
        (data: MediaFile[]) => {
          if (data.length > 0) {
            this.copyFileToLocalDirDirect(data[0].fullPath, 'photo');
          }
        },
        (err: CaptureError) => console.error(err)
    );
    // this.ref.detectChanges();
  }
  recordVideo() {
    this.mediaCapture.captureVideo().then(
        (data: MediaFile[]) => {
          if (data.length > 0) {
            this.copyFileToLocalDirDirect(data[0].fullPath,'video');
          }
        },
        (err: CaptureError) => console.error(err)
    );

  }
  recordAudio() {
    this.mediaCapture.captureAudio().then(
        (data: MediaFile[]) => {
          if (data.length > 0) {
            this.copyFileToLocalDirDirect(data[0].fullPath,'audio');
          }
        },
        (err: CaptureError) => console.error(err)
    );

  }
  copyFileToLocalDirDirect(fullPath ,type ){
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }

    const ext = myPath.split('.').pop();
    const d = Date.now();
    // const newName = `${d}.${ext}`;
    const newName = `${this.uuidv4()}.${ext}`;
    console.log('newname', newName);
    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;
    this.file.copyFile(copyFrom, name, copyTo, newName).then(
        success => {
          this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
              res => {

                console.log('resrrrr',res);
                res.forEach((e,index) =>{
                  if(e.name == newName){
                    this.currentFile.path = e.nativeURL.substr(0, e.nativeURL.lastIndexOf('/') + 1);
                    this.currentFile.name = e.name;
                    this.startUpload(e,index,this.problem.title.vi);
                  }
                })

              },
              err => console.log('error loading files: ', err)
          );
        },
        error => {
          console.log('error: asdad', error);
        }
    );
    this.ref.detectChanges();
  }

  copyFileToLocalDir(fullPath) {
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }

    const ext = myPath.split('.').pop();
    const d = Date.now();
    // const newName = `${d}.${ext}`;
    const newName = `${this.uuidv4()}.${ext}`;
    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;
    this.file.copyFile(copyFrom, name, copyTo, newName).then(
        success => {
          this.loadFiles();
          //  this.onCancel();
        },
        error => {
          console.log('error: asdad', error);
        }
    );
    this.ref.detectChanges();
  }
  openFileOnServer(path){
    this.photoViewer.show(path, 'MY awesome image');
  }
  openFile(f: FileEntry) {
 //   console.log(f);
    if (f.name.indexOf('.wav') > -1) {
      // We need to remove file:/// from the path for the audio plugin to work
    //  console.log(f,'wav');
      const path =  f.nativeURL.replace(/^file:\/\//, '');
      const audioFile: MediaObject = this.media.create(path);
      audioFile.play();
    } else if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {
      // E.g: Use the Streaming Media plugin to play a video
      this.streamingMedia.playVideo(f.nativeURL);
    } else if (f.name.indexOf('.jpg') > -1) {
      // E.g: Use the Photoviewer to present an Image
      //http://222.255.252.41/content/uploads/logo.jpg
     // this.photoViewer.show('http://222.255.252.41/content/uploads/logo.jpg', 'image');

      this.photoViewer.show(f.nativeURL, 'MY awesome image');
    }
  }

  deleteFile(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    this.file.removeFile(path, f.name).then(() => {

      this.loadFiles();
    }, err => console.log('error remove: ', err));
  }
  async startUpload(imgEntry,index,typeProblem) {
//    console.log(imgEntry);
//    console.log('upload');
    const path = imgEntry.nativeURL;
    this.file.resolveLocalFilesystemUrl(path)
        .then(entry =>
        {
          console.log(entry);
          ( < FileEntry > entry).file(file => this.readFile(file,index,typeProblem))
        })
        .catch(err => {
          this.presentToast('Error while reading file.');
        });
  }
  async readFile(file: any,index,typeProblem) {
 //   console.log(file);
 //   console.log('read file');
    const reader = getFileReader();
    reader.onloadend = () => {
   //   console.log('vao day');
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });

      formData.append('file', imgBlob, file.name);
      this.uploadImageData(formData,file.type,index,typeProblem);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData,type,index,typeProblem) {
 //   console.log('typeProb uploadimagedata',typeProblem);
    //  console.log('formdata', formData);

    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();
    this.http.post( environment.docUpload, formData)
        .pipe(
            finalize(() => {
              loading.dismiss();
            })
        )
        .subscribe((res : any) => {
          if(type.indexOf('jpeg')){
            type = 'jpeg';
          }
          /*if(type.indexOf('jpg')){
              type = 'jpg';
          }*/
          /* if(type.indexOf('wav')){
               type = 'wav';
           }
           if(type.indexOf('MOV')){
               type = 'MOV';
           }*/
          // f.name.indexOf('.wav'
          if (res) {
            const temp = res;
            var data = {
              ext : type,
              attr :"",
              lang : "",
              name : temp.name,
              path : temp.path,
              type : type,
              title : "",
              typeProblem: typeProblem
            };
            var data2 = JSON.stringify(data);
            var requestObject = {
              uuid : this.uuidv4(),
              data : data2,
              workflow : null,
              module : temp.module,
              model : temp.model,
              modelUuid : this.currentAudit.uuid
            } ;

            /* var obj2 =  JSON.stringify(requestObject);
               this.HTTP.setDataSerializer('json');
               this.HTTP.setDataSerializer( "utf8" );*/

            //https://stackoverflow.com/questions/51417208/ionic-native-http-call-with-content-type-text-plan

            this.http.post(environment.coreFileUpload ,requestObject,httpOptions)
                .subscribe(
                    data => {
                 //     console.log('data 2020',data);
                      var imgUrl =environment.upload;
                      var temp = JSON.parse(JSON.stringify(data));
                      temp.data = JSON.parse(temp.data);
                      var path = imgUrl.concat(temp.data.path);
                      path = path.concat('/');
                      var databack = {
                        name : temp.data.name,
                        path : path.concat(temp.data.name),
                        typeProblem : typeProblem,
                        uuid : requestObject.uuid,
                        uuid_img : temp.uuid
                      };
                      // add to service observer
                      this.auditData.File.pipe(take(1)).subscribe(file =>{
                        temp = file.concat(databack);
                        this.auditData.setFile(this.currentAudit.uuid,temp);
                      });

                      this.file.removeFile(this.currentFile.path, this.currentFile.name).then(() => {

                        this.loadFiles();
                      }, err => console.log('error remove: ', err));



                      this.message ="Bạn Đã Gửi Thành Công" },
                    error =>{console.log("error",error)}
                )
            ;
         //   console.log('data',data);
            this.presentToast('File upload thành công.');
            this.reloadFile();
          } else {
            this.presentToast('File upload thất bại.')
          }
        });
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
    {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  loadFiles() {
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
        res => {
       //   console.log('resrrrr',res);
          this.files = [];
          this.imageArr = [];
          res.forEach(e=>{
            this.files = this.files.concat(e);
            this.ref.detectChanges();
          });
        },
        err => console.log('error loading files: ', err)
    );
  }
  openImageViewer(index) {
    this.modalCtrl.create({
      component: AuditImageZoomComponent,
      componentProps: {
        filesArr: this.filesArr,
        index: index,
     //   nd: nd
      }
    }).then(modal => {
      modal.present();
    //  console.log(this.filesArr);
    });
  }
 /* playAudio(url) {
    // Play the audio file at url
    // @ts-ignore
    var my_media = new Media(url,
        // success callback
        function() {},
        // error callback
        function(err) {}
    );

    // Play audio
    my_media.play();
  }*/
}
