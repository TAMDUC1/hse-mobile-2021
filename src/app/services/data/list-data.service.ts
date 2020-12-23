import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListDataService {

    private data = [];
    private currenTitle = '';
    constructor() { }
    setData(id, data,title) {
        this.data[id] = data;
        this.currenTitle = title;
    }
    getTitle(){
        return this.currenTitle;
    }
    getData(id) {
        return this.data[id];
    }
}
