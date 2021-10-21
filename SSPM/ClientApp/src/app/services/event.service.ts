import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Filter } from '../models/filter';
import { EventCalendar } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }



  getAllEvents(userid: number) {

    return this.http.get(this.configService.getBaserUrl() + 'event/my/' + userid,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  getEventById(id){
    return this.http.get(this.configService.getBaserUrl() + 'event/eventbyid/' + id,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }


  addEvent(newEvent: EventCalendar) {
    return this.http.post(this.configService.getBaserUrl() + 'event/addnewevent', newEvent,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  deleteEvent(id: number) {
    return this.http.delete(this.configService.getBaserUrl() + 'event/deleteevent/' + id,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }


  updateEvent(model:EventCalendar) {
    return this.http.put(this.configService.getBaserUrl() + 'event/updateevent',model,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );

  }

}
