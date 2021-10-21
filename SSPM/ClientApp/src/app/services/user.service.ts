import { User } from './../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }



  getAllUsers(filter) {

    return this.http.post(this.configService.getBaserUrl() + 'user/all', filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }


  addUser(newUser: User) {
    return this.http.post(this.configService.getBaserUrl() + 'user/addnewuser', newUser,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  deleteUser(id: number) {
    return this.http.delete(this.configService.getBaserUrl() + 'user/deleteuser/' + id,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }


  getRolesSelectItems(){
    return this.http.get(this.configService.getBaserUrl() + 'user/roleselectitems',
    {
      headers: new HttpHeaders({
        "Authorization": "JWT " + localStorage.getItem('jwt'),
        "Content-Type": "application/json"
      })
  });
}

}
