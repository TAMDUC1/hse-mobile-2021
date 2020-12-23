import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentDataService {

    private data = [];

    constructor() { }
    setData(id, data) {
        console.log('set data vi tri ' + id + 'data la ' + data);
        this.data[id] = data;
    }

    getData(id) {
        return this.data[id];
    }}
