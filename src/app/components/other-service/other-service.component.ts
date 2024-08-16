import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { Cities } from 'src/app/shared/models/cities';
import { Dsa } from 'src/app/shared/models/dsa';
import { OtherLoan } from 'src/app/shared/models/other-loan';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { OtherLoanService } from 'src/app/shared/services/other-Loan.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';

@Component({
  selector: 'app-other-service',
  templateUrl: './other-service.component.html',
  styleUrls: ['./other-service.component.scss']
})
export class OtherServiceComponent implements OnInit {
  private token: string
  private fetchRecord: number;
  private alertMessage: string;
  public otherServices: OtherLoan[] = new Array<OtherLoan>();
  public otherService:any = new OtherLoan();
  public isShowParentSelection: boolean = true;
  public selectedOtherService = [];
  public selectedUserId = [];
  public displayColumns = ["id", "fullName", "birthdate", "panCardNo", "aadhaarCardNo", "contactNo", "monthlyincome", "addressline1", "serviceName", "createdDate", "Action"];
  public title: string;
  public user: Users = new Users();
  private startIndex: number;
  public searchString: string;
  public cities: Cities[] = new Array<Cities>();
  public employments: OtherLoan[] = new Array<OtherLoan>();
  public serviceTypes: OtherLoan[] = new Array<OtherLoan>();
  public dsas: Dsa[] = new Array<Dsa>();
  public dsa = new Dsa();
  public isAlert: boolean;
  public alertType: string;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  public paginate: any;
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public serviceId = [];

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private otherLoanService: OtherLoanService,
    private dsaService: DsaService,
    private paginationService: PaginationService,
    public toggleMenuService: ToggleMenuService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'otherService');
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
    await this.getEmploymentTypes();
    await this.getServicesByServiceTypeId();
  }

  otherServiceform = new FormGroup({
    'fullName': new FormControl('', Validators.required),
    'birthdate': new FormControl(null, Validators.required),
    'panCardNo': new FormControl('', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    'aadhaarCardNo': new FormControl('', [Validators.required, Validators.pattern('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')]),
    'contactNo': new FormControl('', [Validators.required, Validators.minLength(10)]),
    'monthlyincome': new FormControl('', Validators.required),
    'email': new FormControl('', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")]),
    'employmentTypeId': new FormControl('', Validators.required),
    'serviceId': new FormControl('', Validators.required),
    'addressline1': new FormControl('', Validators.required),
    'addressline2': new FormControl(''),
    'pincode': new FormControl(null, Validators.required),
    'cityId': new FormControl(null, Validators.required),
  })

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getOtherService();
    }
  }

  public async onKeyUpEvent(event: any, isChangeCity) {
    try {
      if (event.target.value && event.target.value.length == 6) {
        await this.getCityByPincode(event.target.value, isChangeCity);
      }
    } catch (error) {
    }
  }

  public async getCityByPincode(n, isChangeCity) {
    try {
      let res = await this.dsaService.getCityByPincode(this.fetchRecord, n, this.token);
      if (res && res.status == 200) {
        this.cities = res.recordList;
        if (isChangeCity) {
          this.otherServiceform.get("cityId").setValue(this.cities[0].id)
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
      this.isAlert = true;
      this.alertType = "danger";
      setTimeout(() => {
        this.isAlert = false;
      }, 2000);
    }
  }

  public async getEmploymentTypes() {
    try {
      let res = await this.otherLoanService.getEmploymentTypes(this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.employments = res.recordList;
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

  public async getServicesByServiceTypeId() {
    try {
      let serviceTypeId = 3
      let res = await this.otherLoanService.getServicesByServiceTypeId(serviceTypeId, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.serviceTypes = res.recordList;
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

  public async getOtherService() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let serviceTypeId = 3
      let servicesIds = this.serviceId && this.serviceId.length > 0 ? this.serviceId : [];
      let res = await this.otherLoanService.getOtherLoan(this.startIndex, this.fetchRecord, searchString, servicesIds, serviceTypeId, null, this.token);
      if (res && res.status == 200) {
        this.otherServices = res.recordList;
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

  public async insertUpdateotherService() {
    try {
      if (this.otherServiceform.valid) {
        this.spinnerService.show();
        let id = this.otherService.id;
        let userId = this.otherService.userId;
        this.otherService = this.otherServiceform.value;
        this.otherService.id = id;
        let service = this.otherService.id ? this.otherService.id : null;
        this.otherService.id = service;
        this.otherService.userId = userId;
        this.otherService.userId = this.otherService.userId ? this.otherService.userId : null;
        this.otherService.addressline2 = this.otherService.addressline2 ? this.otherService.addressline2 : null;
        this.otherService.serviceTypeId = 3
        this.otherService.city = this.cities[this.cities.findIndex(c => c.id == this.otherServiceform.get('cityId').value)].name;
        let res = await this.otherLoanService.insertUpdateOtherLoanDetail(this.otherService, this.token);
        if (res && res.status == 200) {
          this.modalService.dismissAll();
          this.spinnerService.hide();
          await this.getOtherService();
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.otherServiceform.controls).forEach(key => {
          this.otherServiceform.controls[key].markAsTouched();
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public async modalOpen(basicmodal: any) {
    this.otherServiceform.reset();
    // this.modalService.open(basicmodal, { size: 'xl' });
    this.modalService.open(basicmodal, { size: 'xl', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Insert Other Service";
    this.otherService = new OtherLoan();
    this.isShowParentSelection = true;
    this.selectedOtherService = this.otherServices;
  }

  public editDialog(element: OtherLoan, basicmodal) {
    // this.modalService.open(basicmodal, { size: 'xl' });
    this.modalService.open(basicmodal, { size: 'xl', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Edit Other Service"
    this.otherService = new OtherLoan();
    this.otherService = element;
    this.getCityByPincode(this.otherService.pincode, false)
    this.otherServiceform.setValue({
      "fullName": this.otherService.fullName,
      "birthdate": this.otherService.birthdate,
      "panCardNo": this.otherService.panCardNo,
      "aadhaarCardNo": this.otherService.aadhaarCardNo.replace(/\s/g, ""),
      "contactNo": this.otherService.contactNo,
      "monthlyincome": this.otherService.monthlyincome,
      "email": this.otherService.email,
      "employmentTypeId": this.otherService.employmentTypeId,
      "serviceId": this.otherService.serviceId,
      "addressline1": this.otherService.addressline1,
      "addressline2": this.otherService.addressline2,
      "pincode": this.otherService.pincode,
      "cityId": this.otherService?.cityId ? this.otherService.cityId : null,
    })
    this.selectedOtherService = this.otherServices.filter(c => c.id != element.id);
  }

  public clearSearch() {
    this.searchString = null;
    this.serviceId = [];
    this.setPage(1);
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }


  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let serviceTypeId = 3
      let servicesIds = this.serviceId && this.serviceId.length > 0 ? this.serviceId : [];
      let res = await this.otherLoanService.getOtherLoan(null, null, searchString, servicesIds, serviceTypeId, null, this.token);
      let otherLoans = [];
      if (res && res.status == 200) {
        otherLoans = res.recordList;
      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(otherLoans);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['Name', 'Contact', 'BirthDate', 'PanCardNo', 'AadharCard No', 'Monthly Income', 'Address', 'Service Name']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'OtherService_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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
      let bdt = '';
      if (array[j].birthdate) {
        bdt = new Date(array[j].birthdate).getFullYear() + "-" + ("0" + (new Date(array[j].birthdate).getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date(array[j].birthdate).getDate())).slice(-2);
      }
      let address = array[j].addressline1 + '-' + array[j].addressline2 + '-' + array[j].city + '-' + array[j].pincode
      line += '\n' + (j + 1) + ',' + array[j].fullName + ',' + array[j].contactNo + "," + bdt + "," + array[j].panCardNo + "," + array[j].aadhaarCardNo + "," + array[j].monthlyincome + "," + address + ',' + array[j].serviceName

    }
    str += line + '\r\n';
    return str;
  }
}