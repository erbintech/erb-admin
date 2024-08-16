import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { RewardCoinService } from 'src/app/shared/services/reward-Coin.server';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
import { TrainingService } from 'src/app/shared/services/training.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-user-scratch-card',
  templateUrl: './user-scratch-card.component.html',
  styleUrls: ['./user-scratch-card.component.scss']
})
export class UserScratchCardComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  public dateFrom: Date
  public dateTo: Date
  public rewardTypeId: number
  public roleId: number
  public isScratched: boolean
  public searchString: string
  public userScratchCard = [];
  public paginate :any = {} 
  public rewardTypes = [];
  public roles = [];
  public displayColumns = ['id', 'user', 'contact', 'userRole', 'rewardType', 'value', 'isScratched', 'createdDate']

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private userService: UsersService,
    private rewardCoinService: RewardCoinService,
    private modalService: NgbModal,
    private trainingService: TrainingService,
    public toggleMenuService: ToggleMenuService
  ) { 
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'userScratchCard');
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
    await this.getRewardType();
    await this.getRoles();
  }


  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getUsersScratchCard();
    }
  }

  public async getUsersScratchCard() {
    try {
      this.searchString = this.searchString ? this.searchString : null;
      let res = await this.userService.getUserScratchCard(this.startIndex, this.fetchRecord, this.searchString, this.roleId, this.rewardTypeId, this.dateFrom, this.dateTo, this.token)
      if (res && res.status == 200) {
        this.userScratchCard = res.recordList;
        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
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
      this.toastrService.error(this.alertMessage);
    }
  }


  public async getRewardType() {
    try {
      this.spinnerService.show();
      let res = await this.rewardCoinService.getRewardType(this.token);
      if (res && res.status == 200) {
        this.rewardTypes = res.recordList;
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

  public async getRoles() {
    try {
      this.spinnerService.show();
      let res = await this.trainingService.getRoles(this.token);
      if (res && res.status == 200) {
        this.roles = res.recordList;
        if (this.roles && this.roles.length > 0) {
          this.roles = this.roles.filter(c => c.name == "DSA" || c.name == "SUBDSA" || c.name == "CONNECTOR" || c.name == "EMPLOYEE" || c.name == "CUSTOMERS")
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

  public async clearSearch() {
    this.dateFrom = null;
    this.dateTo = null;
    this.rewardTypeId = null;
    this.searchString = null;
    this.roleId = null;
    this.isScratched = null;
    await this.getUsersScratchCard();
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      this.searchString = this.searchString ? this.searchString : null;
      let res = await this.userService.getUserScratchCard(null, null, this.searchString, this.roleId, this.rewardTypeId, this.dateFrom, this.dateTo, this.token)
      let UserScratchCard = [];
      if (res && res.status == 200) {
        UserScratchCard = res.recordList;
        if (UserScratchCard && UserScratchCard.length > 0) {
          for (let index = 0; index < UserScratchCard.length; index++) {
            UserScratchCard[index].code = UserScratchCard[index].permanentCode ? UserScratchCard[index].permanentCode : UserScratchCard[index].temporaryCode

          }
        }
      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(UserScratchCard);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['User', 'Contact', 'Role', 'Reward Type', 'value', 'Scratched', 'Created Date']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'USERSCRATCHCARD_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
    dwldLink.setAttribute("download", fileName + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  private ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    let line = '';
    for (let j = 0; j < array.length; j++) {
      let createdDate = '';
      if (array[j].createdDate) {
        createdDate = new Date(array[j].createdDate).getFullYear() + "-" + ("0" + (new Date(array[j].createdDate).getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date(array[j].createdDate).getDate())).slice(-2);
      }
      let isScratched = array[j].isScratched == 0 ? false : true
      line += '\n' + (j + 1) + ',' + array[j].fullName + ',' + array[j].contactNo + ',' + array[j].roleName + ',' + array[j].rewardType + ',' + array[j].value + ',' + isScratched + ',' + createdDate
    }
    str += line + '\r\n';
    return str;
  }

}