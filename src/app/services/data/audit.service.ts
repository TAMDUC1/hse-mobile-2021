import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private fileObserver = new BehaviorSubject(
      []
  );
  private document ={
    uuid: '',
    title:'',
    page : 0
  };
  setFile(uuid, arr) {
    console.log('set file ',uuid,' ', arr);
    this.fileObserver.next(arr)
  }


  get File() {
    return this.fileObserver.asObservable();
  }
  deleteFile(uuid){
    const Arr: any[] = this.fileObserver.getValue();

    Arr.forEach((e,index) => {
      if (e.uuid_img === uuid) { Arr.splice(index, 1); }
    });

    this.fileObserver.next(Arr);
  }
  private audit = {};
  private auditLv = {

  };
  constructor() { }
  setAuditLv(lv){
    this.auditLv = lv;
  }
  setAudit(audit) {
    this.audit = audit;
  }

  getAudit() {
    return this.audit;
  }
  getAuditLv() {
    return this.auditLv;
  }
  setDocument(uuid,title,page){
    this.document.uuid = uuid;
    this.document.title = title;
    this.document.page = page;

  }
  getDocument(){
    return this.document;
  }
}
