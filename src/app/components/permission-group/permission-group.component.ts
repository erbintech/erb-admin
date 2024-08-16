import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PermissionGroup } from 'src/app/shared/models/users/permissionGroup';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { PermissionGroupService } from 'src/app/shared/services/permission-group.service';

@Component({
  selector: 'app-permission-group',
  templateUrl: './permission-group.component.html',
  styleUrls: ['./permission-group.component.scss']
})
export class PermissionGroupComponent implements OnInit {

  public token: string
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public alertMessage: string;
  public isAlert: boolean = false;
  public alertType: string;
  public title: string;
  public displayColumns = ['id', 'name', 'createdDate', 'status', 'action'];

  public permissionGroup: PermissionGroup[] = [];

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    public toastrService: ToastrService,
    private paginationService: PaginationService,
    private router: Router,
    public permissionGroupService: PermissionGroupService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'trainingCategories');
      if (ind >= 0) {
        let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
        this.isReadPermission = (roleId == 1) ? true : this._userPagePermission[ind].readPermission;
        this.isWritePermission = (roleId == 1) ? true : this._userPagePermission[ind].writePermission;
        this.isEditPermission = (roleId == 1) ? true : this._userPagePermission[ind].editPermission;
        this.isDeletePermission = (roleId == 1) ? true : this._userPagePermission[ind].deletePermission;
      }
    } else {
      let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
      this.isReadPermission = (roleId == 1) ? true : false;
      this.isWritePermission = (roleId == 1) ? true : false;
      this.isEditPermission = (roleId == 1) ? true : false;
      this.isDeletePermission = (roleId == 1) ? true : false;
    }
  }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    await this.setPage(1);
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getPermissionGroup();
    }
  }

  public async getPermissionGroup() {
    try {
      this.spinnerService.show();
      let res = await this.permissionGroupService.getPermissionGroup(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.permissionGroup = res.recordList;
        if (this.permissionGroup && this.permissionGroup.length > 0) {
          this.permissionGroup.forEach(element => {
            element.isActive = element.isActive ? true : false;
            element.isDelete = element.isDelete ? true : false;
          })
        }
        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
      }
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = error.message
      }
      if (error?.error && error.error.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error && error.error.error && error.error.error.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
      this.toastrService.error(this.alertMessage);

    }
  }

  public modalOpen() {
    this.router.navigate(['/permissionGroup/add'])
  }

  public editDialog(ele) {
    if (JSON.parse(sessionStorage.getItem("groupPermission"))) {
      sessionStorage.removeItem("groupPermission")
    }
    sessionStorage.setItem("groupPermission", JSON.stringify(ele));
    this.router.navigate(['/permissionGroup/edit', ele.id])
  }


}
