import { User } from './../models/user';
import { Component, OnInit } from '@angular/core';
import { PagedList } from '../models/paged-list';
import { Filter } from '../models/filter';
import { MessageService, ConfirmationService } from 'primeng/primeng';
import { AdministrationService } from '../services/administration.service';
import { UserService } from '../services/user.service';
import { FilterItem, filterType } from '../models/filter-item';
import { ConfigService } from '../services/config.service';
import { SelectedItem } from '../models/selected-item';
import { Role } from '../models/Role';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {



  userList: PagedList = new PagedList();
  displayDialog = false;
  loading = false;
  filter: Filter = new Filter(10);
  newUser: User = new User();
  roleSelectItemList : SelectedItem[] = [];
  confirmPassword: string ="";



  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private administrationService: AdministrationService,
    private userService: UserService
  ) { }

  ngOnInit() {

    this.newUser = new User();
    this.newUser.role = new Role();
    this.filter.filterItems = [];
    this.getRolesSelect();

    this.filter.filterItems.push(
      new FilterItem("FirstName", filterType.text),
      new FilterItem("LastName", filterType.text),
      new FilterItem("Username", filterType.text),
      new FilterItem("RoleId", filterType.role)
    )

  }

  onLazyLoad(e) {
    this.filter.first = e.first;
    this.filter.rows = e.rows;
    this.getUsers(this.filter);
  }


  getUsers(filter) {
    this.userService.getAllUsers(filter).subscribe((res: PagedList) => {
      this.userList = res;
    },
      error => {
        this.messageService.add({ severity: 'error', detail: JSON.stringify(error) })
      });
  }

  onSearch() {

    this.filter.first = 0;
    this.getUsers(this.filter);
  }

  onNewUserSave() {

    if (this.confirmPassword != this.newUser.password){
      this.messageService.add({ severity: 'error', summary: 'Passwordat nuk perputhen!' })
      return ;
    }

    if (this.newUser.firstName != null &&
      this.newUser.lastName != null &&
      this.newUser.username != null &&
      this.newUser.password != null

      // && (this.confirmPassword == this.newUser.password)

      ) {


      this.userService.addUser(this.newUser).subscribe((res: User) => {
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
        this.getUsers(this.filter);
      },
        error => {
          this.messageService.add({ severity: 'error', summary: error.error })
        }
      )
      this.newUser = new User();
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Ploteso fushat e kerkuara' })

    }

  }


  onUserDelete(id: number) {


    this.confirmationService.confirm({
      message: 'A jeni i sigurte qe deshironi te fshini perdoruesin',
      header: 'Konfirmo',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.userService.deleteUser(id).subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Sukses' })
          this.getUsers(this.filter);

        },
          error => {
            this.messageService.add({ severity: 'error', summary: error.error })

          }
        );
      },
      reject: () => {
      }
    });
  }

  getRolesSelect(){
    this.userService.getRolesSelectItems().subscribe((res:SelectedItem[])=>{
      this.roleSelectItemList = res;
    },
    err => {
      this.messageService.add({ severity: 'error', summary: err.error })

    })
  }


}
