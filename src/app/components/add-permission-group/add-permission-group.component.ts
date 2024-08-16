import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Pages } from 'src/app/shared/models/users/pages';
import { PermissionGroup } from 'src/app/shared/models/users/permissionGroup';
import { PermissionGroupPages } from 'src/app/shared/models/users/permissionGroupPages';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { PermissionGroupService } from 'src/app/shared/services/permission-group.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-add-permission-group',
  templateUrl: './add-permission-group.component.html',
  styleUrls: ['./add-permission-group.component.scss']
})
export class AddPermissionGroupComponent implements OnInit {
  public isAlert: boolean;
  public alertType: string;//["success","danger","warning"]
  public alertMessage: string;
  public token: string;
  public permissionGroup: PermissionGroup = new PermissionGroup();
  public pageList: Pages[] = new Array<Pages>();
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public isAdminVerificationRequired: boolean;
  public groupId: number;

  constructor(
    private spinnerService: NgxSpinnerService,
    private usersService: UsersService,
    private router: Router,
    private formBuilder: FormBuilder,
    private permissionGroupService: PermissionGroupService,
    private toastrService: ToastrService,
    private actRoute: ActivatedRoute
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

    let groupId = this.actRoute.snapshot.paramMap.get('id');
    this.groupId = parseInt(groupId);
    if (this.groupId) {
      await this.openPagePermissionDialog(this.groupId);
    }
    else {
      await this.openPagePermissionDialog()
    }

  }

  public async openPagePermissionDialog(groupId?: number) {
    this.pageList = JSON.parse(sessionStorage.getItem("pageList")) as Pages[];
    if (groupId) {
      this.permissionGroup = JSON.parse(sessionStorage.getItem("groupPermission")) as PermissionGroup;
      if (this.pageList && this.pageList.length > 0) {
        if (this.permissionGroup.pages && this.permissionGroup.pages.length > 0) {
          for (let i = 0; i < this.permissionGroup.pages.length; i++) {
            let ind = this.pageList.findIndex(c => c.id == this.permissionGroup.pages[i].pageId);
            if (ind >= 0) {
              this.pageList[ind].isChecked = true;
              this.pageList[ind].deletePermission = this.permissionGroup.pages[i].deletePermission;
              this.pageList[ind].editPermission = this.permissionGroup.pages[i].editPermission;
              this.pageList[ind].readPermission = this.permissionGroup.pages[i].readPermission;
              this.pageList[ind].writePermission = this.permissionGroup.pages[i].writePermission;
              this.pageList[ind].isSelectAll = (this.permissionGroup.pages[i].deletePermission && this.permissionGroup.pages[i].editPermission && this.permissionGroup.pages[i].readPermission && this.permissionGroup.pages[i].writePermission) ? true : false;
              this.pageList[ind].isAdminVerificationRequired = this.permissionGroup.pages[i].isAdminVerificationRequired;
            } else {

              for (let c = 0; c < this.pageList.length; c++) {
                for (let f = 0; f < this.pageList[c].children.length; f++) {
                  if (this.pageList[c].children[f].id === this.permissionGroup.pages[i].pageId) {
                    this.pageList[c].children[f].isChecked = true;
                    this.pageList[c].children[f].deletePermission = this.permissionGroup.pages[i].deletePermission;
                    this.pageList[c].children[f].editPermission = this.permissionGroup.pages[i].editPermission;
                    this.pageList[c].children[f].readPermission = this.permissionGroup.pages[i].readPermission;
                    this.pageList[c].children[f].writePermission = this.permissionGroup.pages[i].writePermission;
                    this.pageList[c].children[f].isSelectAll = (this.permissionGroup.pages[i].deletePermission && this.permissionGroup.pages[i].editPermission && this.permissionGroup.pages[i].readPermission && this.permissionGroup.pages[i].writePermission) ? true : false;
                    this.pageList[c].children[f].isAdminVerificationRequired = this.permissionGroup.pages[i].isAdminVerificationRequired;
                  }
                }
              
              }
            }
          }
        }
      }
    }
  }

  public onCheckTreeview(page: Pages): void {
    if (this.permissionGroup.pages && this.permissionGroup.pages.length > 0) {
      let ind = this.permissionGroup.pages.findIndex(c => c.pageId == page.id);
      if (ind >= 0) {
        page.isChecked = false;
        this.permissionGroup.pages.splice(ind, 1);
        page.readPermission = false;
        page.writePermission = false;
        page.editPermission = false;
        page.deletePermission = false;
        page.isAdminVerificationRequired = false;
        page.isSelectAll = false;
        if (page.children && page.children.length > 0) {
          for (let i = 0; i < page.children.length; i++) {
            page.children[i].isChecked = false;
            let _ind = this.permissionGroup.pages.findIndex(c => c.pageId == page.children[i].id);
            if (_ind >= 0) {
              this.permissionGroup.pages.splice(_ind, 1)
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
                flag = this.permissionGroup.pages.findIndex(c => c.pageId == this.pageList[pInd].children[i].id) >= 0;
                if (flag)
                  break;
              }
              if (!flag) {
                let _pInd = this.permissionGroup.pages.findIndex(c => c.pageId == parentId);
                if (_pInd >= 0) {
                  this.pageList[pInd].isChecked = false;
                  this.permissionGroup.pages.splice(_pInd, 1);
                }
              }
            }
          }
        }
      } else {
        page.isChecked = true;
        let permission = new PermissionGroupPages();
        permission.pageId = page.id;
        permission.permissionGroupId = this.groupId;
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
        this.permissionGroup.pages.push(permission);
        if (page.children && page.children.length > 0) {
          for (let i = 0; i < page.children.length; i++) {
            page.children[i].isChecked = true;
            let permission = new PermissionGroupPages();
            permission.pageId = page.children[i].id;
            permission.permissionGroupId = this.groupId;
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
            this.permissionGroup.pages.push(permission);
          }
        } else {
          let parentId = page.parentId;
          if (parentId) {
            let pInd = this.pageList.findIndex(c => c.id == parentId);
            if (pInd >= 0) {
              let flag = false;
              for (let i = 0; i < this.pageList[pInd].children.length; i++) {
                flag = this.permissionGroup.pages.findIndex(c => c.pageId == this.pageList[pInd].children[i].id) < 0;
                if (!flag) {
                  flag = this.permissionGroup.pages.findIndex(c => c.pageId == this.pageList[pInd].id) < 0;
                  if (flag) {
                    //break;
                    this.pageList[pInd].isChecked = true;
                    let permission = new PermissionGroupPages();
                    permission.pageId = this.pageList[pInd].id;
                    permission.permissionGroupId = this.groupId;
                    permission.deletePermission = false;
                    permission.editPermission = false;
                    permission.readPermission = false;
                    permission.writePermission = false;
                    permission.isAdminVerificationRequired = false;
                    permission.isSelectAll = false;
                    this.permissionGroup.pages.push(permission);
                  }
                }
              }
            }
          }
        }

      }
    } else {
      page.isChecked = true;
      let permission = new PermissionGroupPages();
      permission.pageId = page.id;
      permission.permissionGroupId = this.groupId;
      permission.deletePermission = false;
      permission.editPermission = false;
      permission.readPermission = false;
      permission.writePermission = false;
      permission.isAdminVerificationRequired = false;
      permission.isSelectAll = false;
      this.permissionGroup.pages.push(permission);
      if (page.children && page.children.length > 0) {
        for (let i = 0; i < page.children.length; i++) {
          page.children[i].isChecked = true;
          let permission = new PermissionGroupPages();
          permission.pageId = page.children[i].id;
          permission.permissionGroupId = this.groupId;
          permission.deletePermission = false;
          permission.editPermission = false;
          permission.readPermission = false;
          permission.writePermission = false;
          permission.isAdminVerificationRequired = false;
          permission.isSelectAll = false;
          this.permissionGroup.pages.push(permission);
        }
      } else {
        let parentId = page.parentId;
        if (parentId) {
          let pInd = this.pageList.findIndex(c => c.id == parentId);
          if (pInd >= 0) {
            let flag = false;
            for (let i = 0; i < this.pageList[pInd].children.length; i++) {
              flag = this.permissionGroup.pages.findIndex(c => c.pageId == this.pageList[pInd].children[i].id) < 0;
              if (!flag) {
                flag = this.permissionGroup.pages.findIndex(c => c.pageId == this.pageList[pInd].id) < 0;
                if (flag) {
                  this.pageList[pInd].isChecked = true;
                  let permission = new PermissionGroupPages();
                  permission.pageId = this.pageList[pInd].id;
                  permission.permissionGroupId = this.groupId;
                  permission.deletePermission = false;
                  permission.editPermission = false;
                  permission.readPermission = false;
                  permission.writePermission = false;
                  permission.isAdminVerificationRequired = false;
                  permission.isSelectAll = false;
                  this.permissionGroup.pages.push(permission);
                }
              }

            }
          }
        }
      }
    }
  }

  public onCheckReadPermission(childPage: Pages) {
    let index = this.permissionGroup.pages.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.permissionGroup.pages[index].readPermission) {
        this.permissionGroup.pages[index].readPermission = false
        this.permissionGroup.pages[index].isSelectAll = false;
        childPage.readPermission = false;
        childPage.isSelectAll = false;
      } else {
        this.permissionGroup.pages[index].readPermission = true;
        childPage.readPermission = true;
      }
    }
  }

  public onCheckWritePermission(childPage: Pages) {
    let index = this.permissionGroup.pages.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.permissionGroup.pages[index].writePermission) {
        this.permissionGroup.pages[index].writePermission = false
        this.permissionGroup.pages[index].isSelectAll = false;
        childPage.writePermission = false;
        childPage.isSelectAll = false;
      } else {
        this.permissionGroup.pages[index].writePermission = true;
        childPage.writePermission = true;
      }
    }
  }

  public onCheckEditPermission(childPage: Pages) {
    let index = this.permissionGroup.pages.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.permissionGroup.pages[index].editPermission) {
        this.permissionGroup.pages[index].editPermission = false
        this.permissionGroup.pages[index].isSelectAll = false;
        childPage.editPermission = false;
        childPage.isSelectAll = false;
      } else {
        this.permissionGroup.pages[index].editPermission = true;
        childPage.editPermission = true;
      }
    }
  }

  public onCheckDeletePermission(childPage: Pages) {
    let index = this.permissionGroup.pages.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.permissionGroup.pages[index].deletePermission) {
        this.permissionGroup.pages[index].deletePermission = false
        this.permissionGroup.pages[index].isSelectAll = false;
        childPage.deletePermission = false;
        childPage.isSelectAll = false;
      } else {
        this.permissionGroup.pages[index].deletePermission = true;
        childPage.deletePermission = true;
      }
    }
  }

  public onCheckAdminVerifiedPermission(childPage: Pages) {
    let index = this.permissionGroup.pages.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.permissionGroup.pages[index].isAdminVerificationRequired) {
        this.permissionGroup.pages[index].isAdminVerificationRequired = false
        this.permissionGroup.pages[index].isSelectAll = false;
        childPage.isAdminVerificationRequired = false;
        childPage.isSelectAll = false;
      } else {
        this.permissionGroup.pages[index].isAdminVerificationRequired = true;
        childPage.isAdminVerificationRequired = true;
      }
    }
  }

  public onSelectAll(childPage: Pages) {
    let index = this.permissionGroup.pages.findIndex(c => c.pageId == childPage.id);
    if (index >= 0) {
      if (this.permissionGroup.pages[index].isSelectAll) {
        this.permissionGroup.pages[index].readPermission = false;
        this.permissionGroup.pages[index].writePermission = false;
        this.permissionGroup.pages[index].editPermission = false;
        this.permissionGroup.pages[index].deletePermission = false;
        this.permissionGroup.pages[index].isAdminVerificationRequired = false;
        this.permissionGroup.pages[index].isSelectAll = false;
        childPage.readPermission = this.permissionGroup.pages[index].readPermission ? true : false;
        childPage.writePermission = this.permissionGroup.pages[index].writePermission ? true : false;
        childPage.editPermission = this.permissionGroup.pages[index].editPermission ? true : false;
        childPage.deletePermission = this.permissionGroup.pages[index].deletePermission ? true : false;
        childPage.isAdminVerificationRequired = this.permissionGroup.pages[index].isAdminVerificationRequired ? true : false;
        childPage.isSelectAll = (this.permissionGroup.pages[index].readPermission && this.permissionGroup.pages[index].writePermission && this.permissionGroup.pages[index].editPermission && this.permissionGroup.pages[index].deletePermission && this.permissionGroup.pages[index].isAdminVerificationRequired)
        if (childPage.children && childPage.children.length > 0) {
          for (let j = 0; j < childPage.children.length; j++) {
            let _ind = this.permissionGroup.pages.findIndex(c => c.pageId == childPage.children[j].id);
            if (_ind >= 0) {
              childPage.children[j].isChecked = true;
              childPage.children[j].readPermission = this.permissionGroup.pages[_ind].readPermission ? true : false;
              childPage.children[j].writePermission = this.permissionGroup.pages[_ind].writePermission ? true : false;
              childPage.children[j].editPermission = this.permissionGroup.pages[_ind].editPermission ? true : false;
              childPage.children[j].deletePermission = this.permissionGroup.pages[_ind].deletePermission ? true : false;
              childPage.children[j].isAdminVerificationRequired = this.permissionGroup.pages[_ind].isAdminVerificationRequired ? true : false;
              childPage.children[j].isSelectAll = (this.permissionGroup.pages[_ind].readPermission && this.permissionGroup.pages[_ind].writePermission && this.permissionGroup.pages[_ind].editPermission && this.permissionGroup.pages[_ind].deletePermission && this.permissionGroup.pages[_ind].isAdminVerificationRequired)
            }
          }
        }
      }
      else {
        this.permissionGroup.pages[index].readPermission = true;
        this.permissionGroup.pages[index].writePermission = true;
        this.permissionGroup.pages[index].editPermission = true;
        this.permissionGroup.pages[index].deletePermission = true;
        this.permissionGroup.pages[index].isAdminVerificationRequired = true;
        this.permissionGroup.pages[index].isSelectAll = true;
        childPage.readPermission = this.permissionGroup.pages[index].readPermission ? true : false;
        childPage.writePermission = this.permissionGroup.pages[index].writePermission ? true : false;
        childPage.editPermission = this.permissionGroup.pages[index].editPermission ? true : false;
        childPage.deletePermission = this.permissionGroup.pages[index].deletePermission ? true : false;
        childPage.isAdminVerificationRequired = this.permissionGroup.pages[index].isAdminVerificationRequired ? true : false;
        childPage.isSelectAll = (this.permissionGroup.pages[index].readPermission && this.permissionGroup.pages[index].writePermission && this.permissionGroup.pages[index].editPermission && this.permissionGroup.pages[index].deletePermission && this.permissionGroup.pages[index].isAdminVerificationRequired)
        if (childPage.children && childPage.children.length > 0) {
          for (let j = 0; j < this.pageList[index].children.length; j++) {
            let _ind = this.permissionGroup.pages.findIndex(c => c.pageId == childPage.children[j].id);
            if (_ind >= 0) {
              childPage.children[j].isChecked = true;
              childPage.children[j].readPermission = this.permissionGroup.pages[_ind].readPermission ? true : false;
              childPage.children[j].writePermission = this.permissionGroup.pages[_ind].writePermission ? true : false;
              childPage.children[j].editPermission = this.permissionGroup.pages[_ind].editPermission ? true : false;
              childPage.children[j].deletePermission = this.permissionGroup.pages[_ind].deletePermission ? true : false;
              childPage.children[j].isAdminVerificationRequired = this.permissionGroup.pages[_ind].isAdminVerificationRequired ? true : false;
              childPage.children[j].isSelectAll = (this.permissionGroup.pages[_ind].readPermission && this.permissionGroup.pages[_ind].writePermission && this.permissionGroup.pages[_ind].editPermission && this.permissionGroup.pages[_ind].deletePermission && this.permissionGroup.pages[_ind].isAdminVerificationRequired)
            }
          }
        }
      }
    }
  }

  public async insertPermissionGroup(form: NgForm) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        if (this.permissionGroup?.id) {
          //update
          let res = await this.permissionGroupService.updatePermissionGroup(this.permissionGroup.id, this.permissionGroup.name, this.permissionGroup.pages, this.token);
          if (res && res.status == 200) {
            this.router.navigate(['/permissionGroup']);
          }
        } else {
          //insert
          let res = await this.permissionGroupService.insertPermissionGroup(this.permissionGroup.name, this.permissionGroup.pages, this.token);
          if (res && res.status == 200) {
            this.router.navigate(['/permissionGroup']);
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

  public cancelPermissionGroup() {
    this.router.navigate(['/permissionGroup'])
  }

}
