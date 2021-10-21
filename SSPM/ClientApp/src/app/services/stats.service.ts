import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }


  getAllStats(){
    return this.http.get(this.configService.getBaserUrl() + 'stats/all',
    {
      headers: new HttpHeaders({
        "Authorization": "JWT " + localStorage.getItem('jwt'),
        "Content-Type": "application/json"
      })
    });
  }

}
