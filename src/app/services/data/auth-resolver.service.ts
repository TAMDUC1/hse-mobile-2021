import { Injectable } from '@angular/core';
import {Resolve} from '@angular/router';
import { AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthResolverService implements Resolve<any>{

  constructor(
      private dataService:AuthService,
  ) { }
  resolve(){
    console.log('files from resolve',this.dataService.getAuthEmail());
    return this.dataService.getAuthEmail();
  }


}
