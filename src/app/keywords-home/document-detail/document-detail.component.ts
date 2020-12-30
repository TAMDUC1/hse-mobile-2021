import { Component, OnInit,ViewChild } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PdfViewerComponent} from 'ng2-pdf-viewer';
import {AuditService} from '../../services/data/audit.service';

const DEFAULT_ZOOM:number = 1;
const ZOOM_STEP:number = 0.25;
@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss'],
})

export class DocumentDetailComponent implements OnInit {
  document : any;
  src;
  page;
  public pdfZoom:number = DEFAULT_ZOOM;
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  callBackFn(event) {
    console.log('callBackFn', event);
  }


  constructor(private modalCtrl : ModalController,
              private dataService: AuditService,) { }
  ionViewWillEnter() {
    this.document = this.dataService.getDocument();
    console.log('doc', this.document);
    this.page = this.document.page;


  }

  ngOnInit() {
  //  this.scrollToPage();
  }
  onCancel(){
    this.modalCtrl.dismiss(null,'cancel');
  }
  zoomIn(){
    this.pdfZoom += ZOOM_STEP;

  }
  zoomOut(){
    if (this.pdfZoom > DEFAULT_ZOOM) {
      this.pdfZoom -= ZOOM_STEP;
    }
  }

  scrollToPage() {
    this.pdfComponent.pdfViewer.scrollPageIntoView({
      pageNumber: this.page
    });
  }

}
