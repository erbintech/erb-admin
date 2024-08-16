import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BankService } from 'src/app/shared/services/bank.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ServicesService } from 'src/app/shared/services/services.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-admin-get-commission',
  templateUrl: './admin-get-commission.component.html',
  styleUrls: ['./admin-get-commission.component.scss']
})
export class AdminGetCommissionComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public adminCommission = [];
  public paginate:any;
  public displayHistoryColumns = ["id", "commission", "serviceName", "bankName", "customerName", "customerContactNo", "loanAmount", 'date'];
  public selectedBank: number
  public selectedService: number
  public bank = [];
  public services = [];

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private userService: UsersService,
    private loanservice: ServicesService,
    private bankService: BankService,
    private router:Router
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'adminCommission');
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
    await this.getBanks();
    await this.getServices();
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getAdminCommission();
    }
  }

  public async getAdminCommission() {
    try {
      this.spinnerService.show();
      let res = await this.userService.getAdminCommission(this.startIndex, this.fetchRecord, this.selectedBank, this.selectedService, this.token);
      if (res && res.status == 200) {
        this.adminCommission = res.recordList;

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
      this.toastrService.error(this.alertMessage)
    }
  }

  public clearSearch() {
    this.selectedBank = null;
    this.selectedService = null;
    this.setPage(1)
  }


  public async getBanks() {
    try {
      this.spinnerService.show();
      let res = await this.bankService.getBanks(null, null, null, this.token);
      if (res && res.status == 200) {
        this.bank = res.recordList;
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

  public async getServices() {
    try {
      this.spinnerService.show();
      let res = await this.loanservice.getServices(null, null, this.token);
      if (res && res.status == 200) {
        this.services = res.recordList;
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

  public navigateLoanDetail(ele) {
    let name = ele.serviceName
    if (name == "Mortgage/LAP") {
      this.router.navigate(["LAP/view/", ele.customerLoanId]);
    }
    else {
      let name = ele.serviceName.replace(/\s/g, '-')
      let route = name.toLowerCase() + '/view/' + ele.customerLoanId;
      this.router.navigate([route]);
    }
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let res = await this.userService.getAdminCommission(null, null, this.selectedBank, this.selectedService, this.token);
      let adminCommission = [];
      if (res && res.status == 200) {
        adminCommission = res.recordList;
        if (adminCommission && adminCommission.length > 0) {
          for (let index = 0; index < adminCommission.length; index++) {
            adminCommission[index].code = adminCommission[index].permanentCode ? adminCommission[index].permanentCode : adminCommission[index].temporaryCode

          }
        }
      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(adminCommission);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['Commision', 'Service', 'Bank','CustomerName', 'CustomerContactNo', 'LoanAmount', 'TransactionDate']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'ADMINCOMMISSION_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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
      line += '\n' + (j + 1) + ',' + array[j].commission + ',' + array[j].serviceName + ',' + array[j].bankName + ',' + array[j].fullName + ',' + array[j].contactNo + ',' + array[j].amountDisbursed +  ',' + createdDate

    }
    str += line + '\r\n';
    return str;
  }

}
