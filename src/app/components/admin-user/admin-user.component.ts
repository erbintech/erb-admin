import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Pages } from 'src/app/shared/models/users/pages';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
import { TrainingService } from 'src/app/shared/services/training.service';
import { UserPagesService } from 'src/app/shared/services/userPages.service';
import { UsersService } from 'src/app/shared/services/users.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {
  public isAlert: boolean;
  public alertType: string;//["success","danger","warning"]
  public alertMessage: string;
  public token: string;
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public profilePic: string
  public users: Users[] = new Array<Users>();
  public user: Users = new Users();
  public displayColumns = ["id", "profilePicUrl", "FullName", "ContactNo", "Email", "Gender", "roleName", "designation", "createdDate", "Blocked", "Disabled", "Action"];
  public title: string;
  public searchString: string;
  public pageList: Pages[] = new Array<Pages>();
  public userPagePermission: UserPages[] = new Array<UserPages>();
  public userId: number;
  public isRequired: boolean = true;

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public roleId: number
  public roles = [];
  public hide: boolean;

  constructor(
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService,
    private paginationService: PaginationService,
    private usersService: UsersService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userPagesService: UserPagesService,
    private toastrService: ToastrService,
    private trainingService: TrainingService,
    public toggleMenuService: ToggleMenuService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'adminUser');
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
    await this.getRoles();
  }

  public async getRoles() {
    try {
      this.spinnerService.show();
      let res = await this.trainingService.getRoles(this.token);
      if (res && res.status == 200) {
        this.roles = res.recordList;
        if (this.roles && this.roles.length > 0) {
          this.roles = this.roles.filter(c => c.name != "DSA" && c.name != "SUBDSA" && c.name != "CONNECTOR" && c.name != "EMPLOYEE" && c.name != "CUSTOMERS" && c.name != "ADMINISTRATOR")
        }
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


  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getUsers();
    }
  }

  public async getUsers() {
    try {
      this.users = new Array<Users>();
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.usersService.getUser(this.startIndex, this.fetchRecord, searchString, this.roleId, this.token);
      if (res && res.status == 200) {
        this.users = res.recordList;

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
      this.isAlert = true;
      this.alertType = "danger";
      setTimeout(() => {
        this.isAlert = false;
      }, 2000);
    }
  }

  public clearSearch() {
    this.searchString = null;
    this.roleId = null;
    this.getUsers();
  }

  public modalOpen(basicmodal: any) {
    this.router.navigate(['/adminUser/add'])
  }

  public async insertUser(form: NgForm) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        this.spinnerService.hide();
      } else {
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
        });
      }
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
      this.isAlert = true;
      this.alertType = "danger";
      setTimeout(() => {
        this.isAlert = false;
      }, 2000);
    }
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

  public editDialog(ele, basicmodal) {
    if (JSON.parse(sessionStorage.getItem("user"))) {
      sessionStorage.removeItem("user")
    }
    sessionStorage.setItem("user", JSON.stringify(ele));
    this.router.navigate(['/adminUser/edit', ele.id])
  }

  public async selectedImage(e: any) {

    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        this.profilePic = image
      }
    }
  }

  public removeImage() {
    this.profilePic = null;
  }

  public deleteDialog(element) {
    Swal.fire({
      html: "<span style='font-weight:600'>You wan't Delete this RM,</span> <br><span style='font-size:12px'>If You Delete this Admin User than all assign loan to this RM Status Will Changed to Pending. </span>",
      title: 'Are you sure?',
      text: "You wan't Delete this Admin User, <br>If You Delete this Admin User than all assign loan to this Admin User Status Will Changed to Pending ",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.usersService.removeRM(element.id, this.token);
          if (res && res.status == 200) {
            this.getUsers();
            Swal.fire(
              'DELETE',
              'Successfully Deleted Admin User',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
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
          this.toastrService.error(this.alertMessage)
        }
      }
    })
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public blockUnBlockUser(element: Users) {
    let block = element.isBlocked ? 'UNBlock' : 'Block'
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't " + block + " this RM",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + block + 'it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.usersService.blockUnBlockRM(element.id, this.token);
          if (res && res.status == 200) {
            element.isBlocked = !element.isBlocked;
            Swal.fire(
              block,
              'Successfully ' + block + ' RM',
              'success'
            )
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
          this.isAlert = true;
          this.alertType = "danger";
          setTimeout(() => {
            this.isAlert = false;
          }, 2000);
        }

      }
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public async openPagePermissionDialog(element: Users, pagePermissionModal) {
    // this.modalService.open(pagePermissionModal);
    this.modalService.open(pagePermissionModal, { windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.pageList = JSON.parse(sessionStorage.getItem("pageList")) as Pages[];
    try {
      this.userId = element.id;
      let res = await this.userPagesService.getUserPages(element.id, this.token);
      if (res && res.status == 200) {
        if (res.recordList && res.recordList.length > 0) {
          sessionStorage.setItem("PagePermission", JSON.stringify(res.recordList));
          this.userPagePermission = res.recordList;
          if (this.userPagePermission && this.userPagePermission.length > 0) {
            for (let i = 0; i < this.userPagePermission.length; i++) {
              this.userPagePermission[i].readPermission = this.userPagePermission[i].readPermission ? true : false;
              this.userPagePermission[i].writePermission = this.userPagePermission[i].writePermission ? true : false;
              this.userPagePermission[i].editPermission = this.userPagePermission[i].editPermission ? true : false;
              this.userPagePermission[i].deletePermission = this.userPagePermission[i].deletePermission ? true : false;
            }
          }
          if (this.pageList && this.pageList.length > 0) {
            for (let i = 0; i < this.pageList.length; i++) {
              let ind = this.userPagePermission.findIndex(c => c.pageId == this.pageList[i].id);
              if (ind >= 0) {
                this.pageList[i].isChecked = true;
                this.pageList[i].readPermission = this.userPagePermission[ind].readPermission ? true : false;
                this.pageList[i].writePermission = this.userPagePermission[ind].writePermission ? true : false;
                this.pageList[i].editPermission = this.userPagePermission[ind].editPermission ? true : false;
                this.pageList[i].deletePermission = this.userPagePermission[ind].deletePermission ? true : false;
              }
              if (this.pageList[i].children && this.pageList[i].children.length > 0) {
                for (let j = 0; j < this.pageList[i].children.length; j++) {
                  let _ind = this.userPagePermission.findIndex(c => c.pageId == this.pageList[i].children[j].id);
                  if (_ind >= 0) {
                    this.pageList[i].children[j].isChecked = true;
                    this.pageList[i].children[j].readPermission = this.userPagePermission[_ind].readPermission ? true : false;
                    this.pageList[i].children[j].writePermission = this.userPagePermission[_ind].writePermission ? true : false;
                    this.pageList[i].children[j].editPermission = this.userPagePermission[_ind].editPermission ? true : false;
                    this.pageList[i].children[j].deletePermission = this.userPagePermission[_ind].deletePermission ? true : false;
                  }
                }
              }
            }
          }
        }
      }
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
      this.isAlert = true;
      this.alertType = "danger";
      setTimeout(() => {
        this.isAlert = false;
      }, 2000);
    }
  }

  public onCheckTreeview(page: Pages): void {
    if (this.userPagePermission && this.userPagePermission.length > 0) {
      let ind = this.userPagePermission.findIndex(c => c.pageId == page.id);
      if (ind >= 0) {
        page.isChecked = false;
        this.userPagePermission.splice(ind, 1);
        if (page.children && page.children.length > 0) {
          for (let i = 0; i < page.children.length; i++) {
            page.children[i].isChecked = false;
            let _ind = this.userPagePermission.findIndex(c => c.pageId == page.children[i].id);
            if (_ind >= 0) {
              this.userPagePermission.splice(_ind, 1)
            }
          }
        } else {
          let parentId = page.parentId;
          if (parentId) {
            let pInd = this.pageList.findIndex(c => c.id == parentId);
            if (pInd >= 0) {
              let flag = false;
              for (let i = 0; i < this.pageList[pInd].children.length; i++) {
                flag = this.userPagePermission.findIndex(c => c.pageId == this.pageList[pInd].children[i].id) >= 0;
                if (flag)
                  break;
              }
              if (!flag) {
                let _pInd = this.userPagePermission.findIndex(c => c.pageId == parentId);
                if (_pInd >= 0) {
                  this.pageList[pInd].isChecked = false;
                  this.userPagePermission.splice(_pInd, 1);
                }
              }
            }
          }
        }
      } else {
        page.isChecked = true;
        let permission = new UserPages();
        permission.pageId = page.id;
        permission.userId = this.userId;
        permission.deletePermission = false;
        permission.editPermission = false;
        permission.readPermission = false;
        permission.writePermission = false;
        this.userPagePermission.push(permission);
        if (page.children && page.children.length > 0) {
          for (let i = 0; i < page.children.length; i++) {
            page.children[i].isChecked = true;
            let permission = new UserPages();
            permission.pageId = page.children[i].id;
            permission.userId = this.userId;
            permission.deletePermission = false;
            permission.editPermission = false;
            permission.readPermission = false;
            permission.writePermission = false;
            this.userPagePermission.push(permission);
          }
        } else {
          let parentId = page.parentId;
          if (parentId) {
            let pInd = this.pageList.findIndex(c => c.id == parentId);
            if (pInd >= 0) {
              let flag = false;
              for (let i = 0; i < this.pageList[pInd].children.length; i++) {
                flag = this.userPagePermission.findIndex(c => c.pageId == this.pageList[pInd].children[i].id) < 0;
                if (!flag) {
                  flag = this.userPagePermission.findIndex(c => c.pageId == this.pageList[pInd].id) < 0;
                  if (flag) {
                    //break;
                    this.pageList[pInd].isChecked = true;
                    let permission = new UserPages();
                    permission.pageId = this.pageList[pInd].id;
                    permission.userId = this.userId;
                    permission.deletePermission = false;
                    permission.editPermission = false;
                    permission.readPermission = false;
                    permission.writePermission = false;
                    this.userPagePermission.push(permission);
                  }
                }
              }
            }
          }
        }

      }
    } else {
      page.isChecked = true;
      let permission = new UserPages();
      permission.pageId = page.id;
      permission.userId = this.userId;
      permission.deletePermission = false;
      permission.editPermission = false;
      permission.readPermission = false;
      permission.writePermission = false;
      this.userPagePermission.push(permission);
      if (page.children && page.children.length > 0) {
        for (let i = 0; i < page.children.length; i++) {
          page.children[i].isChecked = true;
          let permission = new UserPages();
          permission.pageId = page.children[i].id;
          permission.userId = this.userId;
          permission.deletePermission = false;
          permission.editPermission = false;
          permission.readPermission = false;
          permission.writePermission = false;
          this.userPagePermission.push(permission);
        }
      } else {
        let parentId = page.parentId;
        if (parentId) {
          let pInd = this.pageList.findIndex(c => c.id == parentId);
          if (pInd >= 0) {
            let flag = false;
            for (let i = 0; i < this.pageList[pInd].children.length; i++) {
              flag = this.userPagePermission.findIndex(c => c.pageId == this.pageList[pInd].children[i].id) < 0;
              if (!flag) {
                flag = this.userPagePermission.findIndex(c => c.pageId == this.pageList[pInd].id) < 0;
                if (flag) {
                  this.pageList[pInd].isChecked = true;
                  let permission = new UserPages();
                  permission.pageId = this.pageList[pInd].id;
                  permission.userId = this.userId;
                  permission.deletePermission = false;
                  permission.editPermission = false;
                  permission.readPermission = false;
                  permission.writePermission = false;
                  this.userPagePermission.push(permission);
                }
              }

            }
          }
        }
      }
    }
  }

  public onCheckReadPermission(childPage: Pages) {
    let index = this.userPagePermission.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.userPagePermission[index].readPermission) {
        this.userPagePermission[index].readPermission = false
      } else {
        this.userPagePermission[index].readPermission = true;
      }
    }
  }

  public onCheckWritePermission(childPage: Pages) {
    let index = this.userPagePermission.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.userPagePermission[index].writePermission) {
        this.userPagePermission[index].writePermission = false
      } else {
        this.userPagePermission[index].writePermission = true;
      }
    }
  }

  public onCheckEditPermission(childPage: Pages) {
    let index = this.userPagePermission.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.userPagePermission[index].editPermission) {
        this.userPagePermission[index].editPermission = false
      } else {
        this.userPagePermission[index].editPermission = true;
      }
    }
  }

  public onCheckDeletePermission(childPage: Pages) {
    let index = this.userPagePermission.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.userPagePermission[index].deletePermission) {
        this.userPagePermission[index].deletePermission = false
      } else {
        this.userPagePermission[index].deletePermission = true;
      }
    }
  }

  public async insertUpdatePagePermission() {
    try {
      this.spinnerService.show();
      let userId = this.userId;
      let res = await this.userPagesService.insertUserPages(userId, this.userPagePermission, this.token);
      if (res && res.status == 200) {
        this.spinnerService.hide();
        this.closePagePermissionDialog();
      }
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
      this.isAlert = true;
      this.alertType = "danger";
      setTimeout(() => {
        this.isAlert = false;
      }, 2000);
    }
  }

  public closePagePermissionDialog() {
    this.modalService.dismissAll();
  }

}