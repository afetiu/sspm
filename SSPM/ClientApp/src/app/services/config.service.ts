import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {


  // private baseUrl = 'http://192.168.0.121:60000/api/';
  //  private baseUrl = 'http://localhost:53933/api/';
   private baseUrl = document.getElementsByTagName('base')[0].href;

  static loading :boolean;

  constructor() { }

  getBaserUrl(){
    return this.baseUrl;
  }
}
