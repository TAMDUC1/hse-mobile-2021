import { Component, OnInit } from '@angular/core';
import { HTTP} from '@ionic-native/http/ngx';
import {Platform, ToastController, LoadingController,ModalController} from '@ionic/angular';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {DocumentViewer} from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/File/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import {AuditService} from '../services/data/audit.service';
import { DocumentDetailComponent} from './document-detail/document-detail.component';
import { KeywordsCategoryComponent} from './keywords-category/keywords-category.component';

const DEFAULT_ZOOM:number = 1;
const ZOOM_STEP:number = 0.25;

@Component({
  selector: 'app-keywords-home',
  templateUrl: './keywords-home.page.html',
  styleUrls: ['./keywords-home.page.scss'],
})
export class KeywordsHomePage implements OnInit {
  requestObject : any = null;
  requestDoc : any = null;
  dowloadDoc = [];
  filteredDocArrs = [];
  compareArrs = [];

  public pdfZoom:number = DEFAULT_ZOOM;
  private _searchTerm : string;
  get searchTerm():string{
    return this._searchTerm;
  }

  set searchTerm(value:string){
    this._searchTerm = value;
    this.filteredDocArrs = this.onFilter(value);
    /*this._searchTerm = value;
    this.filteredCompArrs = this.onFilter(value);*/
  }
  src="http://222.255.252.41/content/uploads/2020/";
  loading;
  constructor(
     // private ionicComponentService: IonicComponentService,
      private HTTP :HTTP,
      private platform : Platform,
      private file : File,
      private ft : FileTransfer,
      private fileOpener : FileOpener,
      private document : DocumentViewer,
      private toastController: ToastController,
      private loadingCtrl : LoadingController,
      private modalController: ModalController,
      private dataService: AuditService,
  ) { }

  tags = [
    {tag: 'vbpq', title: 'Văn bản pháp quy'},
    {tag: 'vbtd', title: 'Văn bản Tập đoàn'},
    {tag: 'nckh', title: 'Tài liệu nghiên cứu'},
    {tag: 'pccn', title: 'Phòng chống cháy nổ'},
    {tag: 'atvsld', title: 'An toàn vệ sinh lao động'},
    {tag: 'atbx', title: 'An toàn bức xạ'},
    {tag: 'atxd', title: 'An toàn trong xây dựng'},
    {tag: 'athh', title: 'An toàn hàng hải'},
    {tag: 'atsk', title: 'An toàn sức khỏe'},
    {tag: 'uckc', title: 'Ứng cứu khẩn cấp'},
    {tag: 'bvmt', title: 'Bảo vệ môi trường'},
    {tag: 'cuqt', title: 'Công ước quốc tế'},
    {tag: 'luat', title: 'Luật'},
    {tag: 'nghi-dinh', title: 'Nghị định'},
    {tag: 'qdtt', title: 'Quyết định Thủ tướng'},
    {tag: 'thong-tu', title: 'Thông tư'},
    {tag: 'qcvn', title: 'QCVN/TCVN'},
    {tag: 'cvbn', title: 'Công văn Bộ, Ngành'},
    {tag: 'hdtd', title: 'Hướng dẫn của Tập đoàn'}
  ];
  lstKeywordNomarl = [];
  lstKeywordStandard = [];
  lstDocFormatTable = [];
  lst = {
    luat :
        {
          open : false,
          array : []
        },
    nghidinh :  {
      open : false,
      array : []
    },
    thongtu : {
      open : false,
      array : []
    },
    qdtt : {
      open : false,
      array : []
    },
    hdtd :  {
      open : false,
      array : []
    },
  }
  lst2 = [
    {
      title : 'Luật',
      open : false,
      array : []
    },
    {
      title : 'Nghị định',
      open : false,
      array : []
    },
    {
      title : 'Thông tư',
      open : false,
      array : []
    },
    {
      title : 'Quyết định Thủ tướng',
      open : false,
      array : []
    },
    {
      title : 'Hướng dẫn của Tập đoàn',
      open : false,
      array : []
    },
  ]
  ngOnInit() {
    this.getHTTP();
    this.getDoc();
  }
  replaceText(text){
    return text.trim().split(' ').join('%20')
  }
  changeLanguage(alias){
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim();
    return str;
  }
  onFilter(searchString){
    var result = [];

    if(!searchString){
      result = this.dowloadDoc
    }
    else{
      var str = this.changeLanguage(searchString);// doi qua khong dau
      var keyS = str.trim();// bo dau cach
      this.compareArrs.forEach((e)=>{
        e.child.forEach(el =>{
          if(keyS == el){
            result = e.docList;
          }
        })
      });
      if(result.length > 0){
        var tempArr = [];
        result.forEach(e =>
        {
          this.dowloadDoc.forEach(el =>{
            if(el.title == e){
              tempArr.push(el);
            }
          })
        });
        result = tempArr;
      }
    }


    return result;
  }
  zoomIn(){
    this.pdfZoom += ZOOM_STEP;

  }
  zoomOut(){
    if (this.pdfZoom > DEFAULT_ZOOM) {
      this.pdfZoom -= ZOOM_STEP;
    }
  }
  viewDoc(uuid,page){
    console.log('page',page);
    this.loadingCtrl.create({
      message : "Loading..."
    }).then((overlay)=>{
      this.loading = overlay;
      this.loading.present();
    });
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
  getDoc(){
    this.HTTP.get('http://222.255.252.41/api/CmsDocuments',{},{
      'Content-Type' : 'application/json'
    }).then(res =>{
      this.requestDoc = JSON.parse(res.data);
      let i = 1;
      this.requestDoc.forEach((d) => {
        let document = JSON.parse(d.data);
        let doc = {
          id: i++,
          uuid: d.uuid,
          title_locase: this.changeLanguage(document.title.vi),
          title_lc: {
            vi: this.changeLanguage(document.title.vi),
          },
          title: {
            vi: document.title.vi
          },
          tags: document.tags ? document.tags.vi : [],
          desc: document.desc ? this.changeLanguage(document.desc.vi) : '',
          keyWord: []
        };

        if (doc.tags.length > 0){
          doc.tags = doc.tags.map(t => {
            let tag = this.tags.find(t1 => t1.tag == t);
            if(tag != null){
              return tag.title;
            }else{
              return '';
            }
          })
        }

        if (document.items && document.items.length > 0){
          document.items.forEach((i) => {
            if(i.children && i.children.length > 0){
              i.children.forEach((c) => {
                doc.keyWord.push({
                  text: c.text,
                  page: c.page,
                  keyWordArr: c.keyWordArr || []
                });
              });
            }
          });
        }
        this.lstDocFormatTable.push(doc);
      });
      if(this.searchTerm == '' || this.searchTerm == null){
        this.filteredDocArrs = this.lstDocFormatTable;
      }
    }).catch(err => console.log (err))
  }
  getHTTP(refresh = false, refresher?){
    this.HTTP.get('http://222.255.252.41/api/CoreCategories/730f8474-9ebf-48fe-8461-8ce376bc72ce',{},{
      'Content-Type' : 'application/json'
    }).then(res => {
          if(res.data!== null){
            this.requestObject = JSON.parse(res.data);
            let lstKey = JSON.parse(this.requestObject.data);
            lstKey.items.forEach((obj) => {
              if(obj.children && obj.children.length > 0){
                obj.children.forEach((c) => {
                  let key = {
                    parent_id: obj.id,
                    parent_title: obj.title.vi,
                    type: 'lv', /*lĩnh vực*/
                    id: c.id,
                    title: {
                      vi: c.title.vi
                    },
                    title_lc: {
                      vi: this.changeLanguage(c.title.vi)
                    }
                  };
                  this.lstKeywordStandard.push(key);
                  if (c.children && c.children.length > 0){
                    c.children.forEach((c1) => {
                      let key1 = {
                        lv_parent_id: obj.id,
                        lv_parent_title: obj.title.vi,
                        st_parent_id: c.id,
                        st_parent_title: c.title.vi,
                        st_parent_title_lc: this.changeLanguage(c.title.vi),
                        type: 'st', /*Standard*/
                        id: c1.id,
                        title_lc: {
                          vi: this.changeLanguage(c1.title.vi)
                        },
                        title: {
                          vi: c1.title.vi
                        }
                      };
                      this.lstKeywordNomarl.push(key1);
                    });
                  }
                });
              }
            });
          }
        }
    ).catch(err => this.requestObject = err);
  }

  filterDoc(){
    this.filteredDocArrs = [];
    this.lst2 = [
      {
        title : 'Luật',
        open : false,
        array : []
      },
      {
        title : 'Nghị định',
        open : false,
        array : []
      },
      {
        title : 'Thông tư',
        open : false,
        array : []
      },
      {
        title : 'Quyết định Thủ tướng',
        open : false,
        array : []
      },
      {
        title : 'Hướng dẫn của Tập đoàn',
        open : false,
        array : []
      },
    ];


    if(this.searchTerm == '' || this.searchTerm == null){
      this.filteredDocArrs = this.lstDocFormatTable;

    }
    else{
      this.loadingCtrl.create({
        message : "Loading..."
      }).then((overlay)=>{
        this.loading = overlay;
        this.loading.present();
        setTimeout(this.loading.dismiss(), 1000);
      });
      let searchKey = this.changeLanguage(this.searchTerm);
      let searchResults = [];
      let lstKeyS = this.lstKeywordStandard.filter(l=> {
        return l.title_lc.vi.indexOf(searchKey) >= 0;
      });
      searchResults = searchResults.concat(lstKeyS);
      let lstKeyN = this.lstKeywordNomarl.filter(l=> {
        return l.title_lc.vi.indexOf(searchKey) >= 0;
      });
      searchResults = searchResults.concat(lstKeyN);
      if (searchResults.length > 0){
        searchResults.forEach(sr => {
          this.lstDocFormatTable.forEach(obj => {
            let result = Object.assign({}, obj);
            if (obj.title_lc.vi.indexOf(searchKey) >= 0 && !this.filteredDocArrs.find(r => r.uuid == result.uuid && r.nd == obj.title.vi)){
              result.keyWord = result.keyWord.filter(ff => {
                return ff.keyWordArr.indexOf(obj.title_locase) >= 0;
              });
              result.nd = obj.title.vi;
              result.page = 1;
              this.filteredDocArrs.push(result);
            }
            if (obj.keyWord.length > 0){
              obj.keyWord.forEach(obj1 => {
                if(obj1.keyWordArr && obj1.keyWordArr.length > 0 ){
                  obj1.keyWordArr.forEach(k => {
                    if(sr.type === "st"){
                      if (k.indexOf(sr.st_parent_title) >= 0 && !this.filteredDocArrs.find(r => r.uuid == result.uuid && r.nd == sr.st_parent_title)){
                        result.keyWord = result.keyWord.filter(ff => {
                          return ff.keyWordArr.indexOf(sr.st_parent_title) >= 0;
                        });
                        result.nd = sr.st_parent_title;
                        result.page = obj1.page;
                        this.filteredDocArrs.push(result);
                      }
                    }
                    else if (sr.type === "lv"){
                      if (k.indexOf(sr.title.vi) >= 0 && !this.filteredDocArrs.find(r => r.uuid == result.uuid && r.nd == sr.title.vi)){
                        result.keyWord = result.keyWord.filter(ff => {
                          return ff.keyWordArr.indexOf(sr.title.vi) >= 0;
                        });
                        result.nd = sr.title.vi;
                        result.page = obj1.page;
                        this.filteredDocArrs.push(result);
                      }
                    }
                  });
                }
              })
            }
          });
        });
        console.log('this.filteredDocArrs',this.filteredDocArrs);
      }
      if(searchResults.length == 0){
        this.lstDocFormatTable.forEach(obj => {
          console.log('obj',obj);
          let result = Object.assign({}, obj);
          if (obj.title_lc.vi.indexOf(searchKey) >= 0 && !this.filteredDocArrs.find(r => r.uuid == result.uuid && r.nd == obj.title.vi)){
            result.keyWord = result.keyWord.filter(ff => {
              return ff.keyWordArr.indexOf(obj.title.vi) >= 0;
            });
            result.nd = obj.title.vi;
            result.page = 1;
            this.filteredDocArrs.push(result);
          }
          if (obj.keyWord.length > 0){
            obj.keyWord.forEach(obj1 => {
              if(obj1.keyWordArr && obj1.keyWordArr.length > 0 ){
                obj1.keyWordArr.forEach(k => {
                  if (k.indexOf(searchKey) >= 0 && !this.filteredDocArrs.find(r => r.uuid == result.uuid && r.nd == searchKey)){
                    result.keyWord = result.keyWord.filter(ff => {
                      return ff.keyWordArr.indexOf(searchKey) >= 0;
                    });
                    result.nd = searchKey;
                    result.page = obj1.page;
                    this.filteredDocArrs.push(result);
                  }
                });
              }
            });
          }
        });

      }

    }
    if( this.filteredDocArrs.length > 0){
      this.filteredDocArrs.forEach(e =>{
        if(e.tags[0] === 'Luật'){
          this.lst.luat.array.push(e);
          this.lst2[0].array.push(e);
        }
        if(e.tags[0] === 'Nghị định'){
          this.lst.nghidinh.array.push(e);
          this.lst2[1].array.push(e);
        }
        if(e.tags[0] === 'Thông tư'){
          this.lst.thongtu.array.push(e);
          this.lst2[2].array.push(e);
        }
        if(e.tags[0] === 'Quyết định Thủ tướng'){
          this.lst.qdtt.array.push(e);
          this.lst2[3].array.push(e);
        }
        if(e.tags[0] === 'Hướng dẫn của Tập đoàn'){
          this.lst.hdtd.array.push(e);
          this.lst2[4].array.push(e);
        }
      })
    }
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
  toggleSection(index){
    this.lst2[index].open = !this.lst2[index].open;
    console.log('this.lst2[index].open',this.lst2[index].open);
  }
  openKeywordsCategory(item){
    this.modalController.create({
      component: KeywordsCategoryComponent,
      backdropDismiss: false,
      componentProps: {
        src: '',
        page : '',
        data : item
      }
    }).then(modal => {
      modal.present();
    });

  }
}
