import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servicing } from '../models/servicing';

@Injectable({
  providedIn: 'root'
})
export class ServicingService {

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }


  getAllServicings(filter, id) {

    return this.http.post(this.configService.getBaserUrl() + 'servicing/all/'+id, filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  
  getAllServicingsToday(filter, id) {

    return this.http.post(this.configService.getBaserUrl() + 'servicing/alltoday/'+id, filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }
 

  addServicing(servicing: Servicing) {
    return this.http.post(this.configService.getBaserUrl() + 'servicing/addservicing', servicing,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      });
  } 
}
