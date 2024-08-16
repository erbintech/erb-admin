import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Pages } from 'src/app/shared/models/users/pages';
import { PermissionGroup } from 'src/app/shared/models/users/permissionGroup';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { PermissionGroupService } from 'src/app/shared/services/permission-group.service';
import { TrainingService } from 'src/app/shared/services/training.service';
import { UserPagesService } from 'src/app/shared/services/userPages.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
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
  public displayColumns = ["id", "profilePicUrl", "FullName", "ContactNo", "Email", "Gender", "Blocked", "Disabled", "Action"];
  public title: string;
  public searchString: string;
  public pageList: Pages[] = new Array<Pages>();
  public userPagePermission: UserPages[] = new Array<UserPages>();
  public userId: number;
  public isRequired: boolean = true;
  public hide: boolean
  public roles = [];
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public isAdminVerificationRequired: boolean;
  public permissionGroup: PermissionGroup[];

  constructor(
    private spinnerService: NgxSpinnerService,
    private usersService: UsersService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userPagesService: UserPagesService,
    private toastrService: ToastrService,
    private trainingService: TrainingService,
    private actRoute: ActivatedRoute,
    public permissionGroupService: PermissionGroupService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'personal-loan');
      if (ind >= 0) {
        let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
        this.isReadPermission = (roleId == 1) ? true : this._userPagePermission[ind].readPermission;
        this.isWritePermission = (roleId == 1) ? true : this._userPagePermission[ind].writePermission;
        this.isEditPermission = (roleId == 1) ? true : this._userPagePermission[ind].editPermission;
        this.isDeletePermission = (roleId == 1) ? true : this._userPagePermission[ind].deletePermission;
        this.isAdminVerificationRequired = (roleId == 1) ? false : this._userPagePermission[ind].isAdminVerificationRequired
      }
    } else {
      let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
      this.isReadPermission = (roleId == 1) ? true : false;
      this.isWritePermission = (roleId == 1) ? true : false;
      this.isEditPermission = (roleId == 1) ? true : false;
      this.isDeletePermission = (roleId == 1) ? true : false;
      this.isAdminVerificationRequired = (roleId == 1) ? false : true;
    }
  }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    await this.getRoles();
    this.user.gender = "Male";

    let userId = this.actRoute.snapshot.paramMap.get('id');
    this.userId = parseInt(userId);
    if (this.userId) {
      await this.openPagePermissionDialog(this.userId);
      this.user = JSON.parse(sessionStorage.getItem(("user")));
      this.profilePic = this.user.profilePicUrl
    }
    else {
      await this.openPagePermissionDialog()
    }
    await this.getPermissionGroup();
  }

  public async getPermissionGroup() {
    try {
      this.spinnerService.show();
      let res = await this.permissionGroupService.getPermissionGroup(0, 0, this.token);
      if (res && res.status == 200) {
        this.permissionGroup = res.recordList;
        if (this.permissionGroup && this.permissionGroup.length > 0) {
          this.permissionGroup.forEach(element => {
            element.isActive = element.isActive ? true : false;
            element.isDelete = element.isDelete ? true : false;
          })
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

  public changePermissionGroup(event: PermissionGroup) {
    this.pageList = JSON.parse(sessionStorage.getItem("pageList")) as Pages[];
    let permissionGroup = event;
    if (this.pageList && this.pageList.length > 0) {
      if (permissionGroup.pages && permissionGroup.pages.length > 0) {
        for (let i = 0; i < permissionGroup.pages.length; i++) {
          let ind = this.pageList.findIndex(c => c.id == permissionGroup.pages[i].pageId);
          if (ind >= 0) {
            this.pageList[ind].isChecked = true;
            this.pageList[ind].deletePermission = permissionGroup.pages[i].deletePermission;
            this.pageList[ind].editPermission = permissionGroup.pages[i].editPermission;
            this.pageList[ind].readPermission = permissionGroup.pages[i].readPermission;
            this.pageList[ind].writePermission = permissionGroup.pages[i].writePermission;
            this.pageList[ind].isAdminVerificationRequired = permissionGroup.pages[i].isAdminVerificationRequired;
            this.pageList[ind].isSelectAll = (permissionGroup.pages[i].deletePermission && permissionGroup.pages[i].editPermission && permissionGroup.pages[i].readPermission && permissionGroup.pages[i].writePermission) ? true : false;
            let permission = new UserPages();
            permission.pageId = this.pageList[ind].id;
            permission.userId = this.userId;
            permission.deletePermission = this.pageList[ind].deletePermission;
            permission.editPermission = this.pageList[ind].editPermission;
            permission.readPermission = this.pageList[ind].readPermission;
            permission.writePermission = this.pageList[ind].writePermission;
            permission.isAdminVerificationRequired = this.pageList[ind].isAdminVerificationRequired;
            permission.isSelectAll = this.pageList[ind].isSelectAll;
            this.userPagePermission.push(permission);
          } else {
            for (let c = 0; c < this.pageList.length; c++) {
              for (let f = 0; f < this.pageList[c].children.length; f++) {
                if (this.pageList[c].children[f].id === permissionGroup.pages[i].pageId) {
                  this.pageList[c].children[f].isChecked = true;
                  this.pageList[c].children[f].deletePermission = permissionGroup.pages[i].deletePermission;
                  this.pageList[c].children[f].editPermission = permissionGroup.pages[i].editPermission;
                  this.pageList[c].children[f].readPermission = permissionGroup.pages[i].readPermission;
                  this.pageList[c].children[f].writePermission = permissionGroup.pages[i].writePermission;
                  this.pageList[c].children[f].isSelectAll = (permissionGroup.pages[i].deletePermission && permissionGroup.pages[i].editPermission && permissionGroup.pages[i].readPermission && permissionGroup.pages[i].writePermission) ? true : false;
                  this.pageList[c].children[f].isAdminVerificationRequired = permissionGroup.pages[i].isAdminVerificationRequired;
                  let permission = new UserPages();
                  permission.pageId = this.pageList[c].children[f].id;
                  permission.userId = this.userId;
                  permission.deletePermission = this.pageList[c].children[f].deletePermission;
                  permission.editPermission = this.pageList[c].children[f].editPermission;
                  permission.readPermission = this.pageList[c].children[f].readPermission;
                  permission.writePermission = this.pageList[c].children[f].writePermission;
                  permission.isAdminVerificationRequired = this.pageList[c].children[f].isAdminVerificationRequired;
                  permission.isSelectAll = this.pageList[c].children[f].isSelectAll;
                  this.userPagePermission.push(permission);
                }
              }
            }
          }
        }
      }
    }
  }

  public async insertUser(form: NgForm) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let password = btoa(this.user.password);
        this.user.designation = this.user.designation ? this.user.designation : null;
        if (this.user.id) {
          if (this.profilePic && !this.profilePic.includes("https:")) {
            let profile = this.profilePic.split(',')[1];
            this.user.profilePicUrl = profile
          }
          else
            this.user.profilePicUrl = this.profilePic
          this.user.profilePicUrl = this.user.profilePicUrl && this.user.profilePicUrl != '' ? this.user.profilePicUrl : null
          let res = await this.usersService.updateUser(this.user.id, this.user.fullName, this.user.gender, this.user.email, this.user.contactNo, password, this.user.profilePicUrl, this.user.roleId, this.token, this.userPagePermission, this.user.designation,);
          if (res && res.status == 200) {
            this.spinnerService.hide();
            this.router.navigate(['/adminUser'])
          }
        }
        else {
          if (this.profilePic) {
            let profile = this.profilePic.split(',')[1];
            this.user.profilePicUrl = profile
          }
          let res = await this.usersService.insertUser(this.user.fullName, this.user.gender, this.user.email, this.user.contactNo, password, this.user.profilePicUrl, this.user.roleId, this.token, this.userPagePermission, this.user.designation, this.user.permissionGroupId);
          if (res && res.status == 200) {
            this.spinnerService.hide();
            this.router.navigate(['/adminUser'])
          }
        }
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
      this.toastrService.error(this.alertMessage)
    }
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

  public async openPagePermissionDialog(userId?: number) {
    this.pageList = JSON.parse(sessionStorage.getItem("pageList")) as Pages[];
    try {
      if (userId) {
        this.userId = userId;
        let res = await this.userPagesService.getUserPages(userId, this.token);
        if (res && res.status == 200) {
          if (res.recordList && res.recordList.length > 0) {
            this.userPagePermission = res.recordList;
            if (this.userPagePermission && this.userPagePermission.length > 0) {
              for (let i = 0; i < this.userPagePermission.length; i++) {
                this.userPagePermission[i].readPermission = this.userPagePermission[i].readPermission ? true : false;
                this.userPagePermission[i].writePermission = this.userPagePermission[i].writePermission ? true : false;
                this.userPagePermission[i].editPermission = this.userPagePermission[i].editPermission ? true : false;
                this.userPagePermission[i].deletePermission = this.userPagePermission[i].deletePermission ? true : false;
                this.userPagePermission[i].isAdminVerificationRequired = this.userPagePermission[i].isAdminVerificationRequired ? true : false;
                this.userPagePermission[i].isSelectAll = (this.userPagePermission[i].readPermission && this.userPagePermission[i].writePermission && this.userPagePermission[i].editPermission && this.userPagePermission[i].deletePermission && this.userPagePermission[i].isAdminVerificationRequired)
              }
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
                this.pageList[i].isAdminVerificationRequired = this.userPagePermission[ind].isAdminVerificationRequired ? true : false;
                this.pageList[i].isSelectAll = (this.userPagePermission[ind].readPermission && this.userPagePermission[ind].writePermission && this.userPagePermission[ind].editPermission && this.userPagePermission[ind].deletePermission && this.userPagePermission[ind].isAdminVerificationRequired)

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
                    this.pageList[i].children[j].isAdminVerificationRequired = this.userPagePermission[_ind].isAdminVerificationRequired ? true : false;
                    this.pageList[i].children[j].isSelectAll = (this.userPagePermission[_ind].readPermission && this.userPagePermission[_ind].writePermission && this.userPagePermission[_ind].editPermission && this.userPagePermission[_ind].deletePermission && this.userPagePermission[_ind].isAdminVerificationRequired)
                  }
                }
              }
            }
          }
        }
      }
      else {
        for (let index = 0; index < this.pageList.length; index++) {
          this.pageList[index].readPermission = false;
          this.pageList[index].writePermission = false;
          this.pageList[index].editPermission = false;
          this.pageList[index].deletePermission = false;
          this.pageList[index].isAdminVerificationRequired = false;
          this.pageList[index].isSelectAll = false;
          if (this.pageList[index].children && this.pageList[index].children.length > 0) {
            for (let j = 0; j < this.pageList[index].children.length; j++) {
              this.pageList[index].children[j].isChecked = false;
              this.pageList[index].children[j].readPermission = false;
              this.pageList[index].children[j].writePermission = false;
              this.pageList[index].children[j].editPermission = false;
              this.pageList[index].children[j].deletePermission = false;
              this.pageList[index].children[j].isAdminVerificationRequired = false;
              this.pageList[index].children[j].isSelectAll = false
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
      this.toastrService.error(this.alertMessage)
    }
  }


  public onCheckTreeview(page: Pages): void {
    if (this.userPagePermission && this.userPagePermission.length > 0) {
      let ind = this.userPagePermission.findIndex(c => c.pageId == page.id);
      if (ind >= 0) {
        page.isChecked = false;
        this.userPagePermission.splice(ind, 1);
        page.readPermission = false;
        page.writePermission = false;
        page.editPermission = false;
        page.deletePermission = false;
        page.isAdminVerificationRequired = false;
        page.isSelectAll = false;
        if (page.children && page.children.length > 0) {
          for (let i = 0; i < page.children.length; i++) {
            page.children[i].isChecked = false;
            let _ind = this.userPagePermission.findIndex(c => c.pageId == page.children[i].id);
            if (_ind >= 0) {
              this.userPagePermission.splice(_ind, 1)
              page.children[i].readPermission = false;
              page.children[i].writePermission = false;
              page.children[i].editPermission = false;
              page.children[i].deletePermission = false;
              page.children[i].isAdminVerificationRequired = false;
              page.children[i].isSelectAll = false;
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
        permission.deletePermission = true;
        permission.editPermission = true;
        permission.readPermission = true;
        permission.writePermission = true;
        permission.isAdminVerificationRequired = true;
        permission.isSelectAll = true;
        page.deletePermission = true;
        page.editPermission = true;
        page.readPermission = true;
        page.writePermission = true;
        page.isAdminVerificationRequired = true;
        page.isSelectAll = true;
        this.userPagePermission.push(permission);
        if (page.children && page.children.length > 0) {
          for (let i = 0; i < page.children.length; i++) {
            page.children[i].isChecked = true;
            let permission = new UserPages();
            permission.pageId = page.children[i].id;
            permission.userId = this.userId;
            permission.deletePermission = true;
            permission.editPermission = true;
            permission.readPermission = true;
            permission.writePermission = true;
            permission.isAdminVerificationRequired = true;
            permission.isSelectAll = true;
            page.children[i].deletePermission = true;
            page.children[i].editPermission = true;
            page.children[i].readPermission = true;
            page.children[i].writePermission = true;
            page.children[i].isAdminVerificationRequired = true;
            page.children[i].isSelectAll = true;
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
                    permission.isAdminVerificationRequired = false;
                    permission.isSelectAll = false;
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
      permission.isAdminVerificationRequired = false;
      permission.isSelectAll = false;
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
          permission.isAdminVerificationRequired = false;
          permission.isSelectAll = false;
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
                  permission.isAdminVerificationRequired = false;
                  permission.isSelectAll = false;
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
        this.userPagePermission[index].isSelectAll = false;
        childPage.readPermission = false;
        childPage.isSelectAll = false;
      } else {
        this.userPagePermission[index].readPermission = true;
        childPage.readPermission = true;
      }
    }
  }

  public onCheckWritePermission(childPage: Pages) {
    let index = this.userPagePermission.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.userPagePermission[index].writePermission) {
        this.userPagePermission[index].writePermission = false
        this.userPagePermission[index].isSelectAll = false;
        childPage.writePermission = false;
        childPage.isSelectAll = false;
      } else {
        this.userPagePermission[index].writePermission = true;
        childPage.writePermission = true;
      }
    }
  }

  public onCheckEditPermission(childPage: Pages) {
    let index = this.userPagePermission.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.userPagePermission[index].editPermission) {
        this.userPagePermission[index].editPermission = false
        this.userPagePermission[index].isSelectAll = false;
        childPage.editPermission = false;
        childPage.isSelectAll = false;
      } else {
        this.userPagePermission[index].editPermission = true;
        childPage.editPermission = true;
      }
    }
  }

  public onCheckDeletePermission(childPage: Pages) {
    let index = this.userPagePermission.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.userPagePermission[index].deletePermission) {
        this.userPagePermission[index].deletePermission = false
        this.userPagePermission[index].isSelectAll = false;
        childPage.deletePermission = false;
        childPage.isSelectAll = false;
      } else {
        this.userPagePermission[index].deletePermission = true;
        childPage.deletePermission = true;
      }
    }
  }

  public onCheckAdminVerifiedPermission(childPage: Pages) {
    let index = this.userPagePermission.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.userPagePermission[index].isAdminVerificationRequired) {
        this.userPagePermission[index].isAdminVerificationRequired = false
        this.userPagePermission[index].isSelectAll = false;
        childPage.isAdminVerificationRequired = false;
        childPage.isSelectAll = false;
      } else {
        this.userPagePermission[index].isAdminVerificationRequired = true;
        childPage.isAdminVerificationRequired = true;
      }
    }
  }

  public onSelectAll(childPage: Pages) {
    let index = this.userPagePermission.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.userPagePermission[index].isSelectAll) {
        this.userPagePermission[index].readPermission = false;
        this.userPagePermission[index].writePermission = false;
        this.userPagePermission[index].editPermission = false;
        this.userPagePermission[index].deletePermission = false;
        this.userPagePermission[index].isAdminVerificationRequired = false;
        this.userPagePermission[index].isSelectAll = false;
        childPage.readPermission = this.userPagePermission[index].readPermission ? true : false;
        childPage.writePermission = this.userPagePermission[index].writePermission ? true : false;
        childPage.editPermission = this.userPagePermission[index].editPermission ? true : false;
        childPage.deletePermission = this.userPagePermission[index].deletePermission ? true : false;
        childPage.isAdminVerificationRequired = this.userPagePermission[index].isAdminVerificationRequired ? true : false;
        childPage.isSelectAll = (this.userPagePermission[index].readPermission && this.userPagePermission[index].writePermission && this.userPagePermission[index].editPermission && this.userPagePermission[index].deletePermission && this.userPagePermission[index].isAdminVerificationRequired)
        if (childPage.children && childPage.children.length > 0) {
          for (let j = 0; j < childPage.children.length; j++) {
            let _ind = this.userPagePermission.findIndex(c => c.pageId == childPage.children[j].id);
            if (_ind >= 0) {
              childPage.children[j].isChecked = true;
              childPage.children[j].readPermission = this.userPagePermission[_ind].readPermission ? true : false;
              childPage.children[j].writePermission = this.userPagePermission[_ind].writePermission ? true : false;
              childPage.children[j].editPermission = this.userPagePermission[_ind].editPermission ? true : false;
              childPage.children[j].deletePermission = this.userPagePermission[_ind].deletePermission ? true : false;
              childPage.children[j].isAdminVerificationRequired = this.userPagePermission[_ind].isAdminVerificationRequired ? true : false;
              childPage.children[j].isSelectAll = (this.userPagePermission[_ind].readPermission && this.userPagePermission[_ind].writePermission && this.userPagePermission[_ind].editPermission && this.userPagePermission[_ind].deletePermission && this.userPagePermission[_ind].isAdminVerificationRequired)
            }
          }
        }
      }
      else {
        this.userPagePermission[index].readPermission = true;
        this.userPagePermission[index].writePermission = true;
        this.userPagePermission[index].editPermission = true;
        this.userPagePermission[index].deletePermission = true;
        this.userPagePermission[index].isAdminVerificationRequired = true;
        this.userPagePermission[index].isSelectAll = true;
        childPage.readPermission = this.userPagePermission[index].readPermission ? true : false;
        childPage.writePermission = this.userPagePermission[index].writePermission ? true : false;
        childPage.editPermission = this.userPagePermission[index].editPermission ? true : false;
        childPage.deletePermission = this.userPagePermission[index].deletePermission ? true : false;
        childPage.isAdminVerificationRequired = this.userPagePermission[index].isAdminVerificationRequired ? true : false;
        childPage.isSelectAll = (this.userPagePermission[index].readPermission && this.userPagePermission[index].writePermission && this.userPagePermission[index].editPermission && this.userPagePermission[index].deletePermission && this.userPagePermission[index].isAdminVerificationRequired)
        if (childPage.children && childPage.children.length > 0) {
          for (let j = 0; j < this.pageList[index].children.length; j++) {
            let _ind = this.userPagePermission.findIndex(c => c.pageId == childPage.children[j].id);
            if (_ind >= 0) {
              childPage.children[j].isChecked = true;
              childPage.children[j].readPermission = this.userPagePermission[_ind].readPermission ? true : false;
              childPage.children[j].writePermission = this.userPagePermission[_ind].writePermission ? true : false;
              childPage.children[j].editPermission = this.userPagePermission[_ind].editPermission ? true : false;
              childPage.children[j].deletePermission = this.userPagePermission[_ind].deletePermission ? true : false;
              childPage.children[j].isAdminVerificationRequired = this.userPagePermission[_ind].isAdminVerificationRequired ? true : false;
              childPage.children[j].isSelectAll = (this.userPagePermission[_ind].readPermission && this.userPagePermission[_ind].writePermission && this.userPagePermission[_ind].editPermission && this.userPagePermission[_ind].deletePermission && this.userPagePermission[_ind].isAdminVerificationRequired)
            }
          }
        }
      }
    }
  }

  // public async insertUpdatePagePermission() {
  //   try {
  //     this.spinnerService.show();
  //     let userId = this.userId;
  //     let res = await this.userPagesService.insertUserPages(userId, this.userPagePermission, this.token);
  //     if (res && res.status == 200) {
  //       this.spinnerService.hide();
  //     }
  //   } catch (error) {
  //     this.spinnerService.hide();
  //     this.alertMessage = error;
  //     if (error?.message) {
  //       this.alertMessage = error.message
  //     }
  //     if (error?.error && error.error.message) {
  //       this.alertMessage = error.error.message
  //     }
  //     if (error?.error && error.error.error && error.error.error.functionErrorMessage) {
  //       this.alertMessage = error.error.error.functionErrorMessage
  //     }
  //     this.toastrService.error(this.alertMessage)
  //   }
  // }

  public cancelUser() {
    this.router.navigate(['/adminUser'])
  }


}
