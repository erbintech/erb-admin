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
  selector: 'app-other-loan',
  templateUrl: './other-loan.component.html',
  styleUrls: ['./other-loan.component.scss']
})

export class OtherLoanComponent implements OnInit {
  private token: string
  private fetchRecord: number;
  private alertMessage: string;
  public otherLoans: OtherLoan[] = new Array<OtherLoan>();
  public otherLoan: any = new OtherLoan();
  public isShowParentSelection: boolean = true;
  public selectedOtherLoan = [];
  public displayColumns = ["id", "fullName", "birthdate", "panCardNo", "aadhaarCardNo", "contactNo", "monthlyincome", "addressline1", "serviceName", 'createdDate', "Action"];
  public title: string;
  public user: Users = new Users();
  private startIndex: number;
  public searchString: string;
  public cities: Cities[] = new Array<Cities>();
  public dsas: Dsa[] = new Array<Dsa>();
  public employments: OtherLoan[] = new Array<OtherLoan>();
  public serviceTypes: OtherLoan[] = new Array<OtherLoan>();
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
  public selectedService = [];


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
      let ind = this._userPagePermission.findIndex(c => c.name == 'otherLoan');
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
    await this.getServicesByServiceTypeId();
    await this.getEmploymentTypes();
  }

  otherLoanform = new FormGroup({
    'fullName': new FormControl('', Validators.required),
    'birthdate': new FormControl(null, Validators.required),
    'panCardNo': new FormControl('', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    'aadhaarCardNo': new FormControl('', [Validators.required, Validators.pattern('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')]),
    'contactNo': new FormControl(null, [Validators.required, Validators.minLength(10)]),
    'monthlyincome': new FormControl('', Validators.required),
    'email': new FormControl('', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")]),
    'employmentTypeId': new FormControl(null, Validators.required),
    'serviceId': new FormControl(null, Validators.required),
    'addressline1': new FormControl('', Validators.required),
    'addressline2': new FormControl(''),
    'pincode': new FormControl('', Validators.required),
    'cityId': new FormControl(null, Validators.required),
  })

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getOtherLoan();
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
        this.otherLoan.city = this.cities[0].name;
        if (isChangeCity) {
          this.otherLoanform.get("cityId").setValue(this.cities[0].id)
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
      this.toastrService.error(this.alertMessage)
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
      let serviceTypeId = 2
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

  public async getOtherLoan() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let serviceTypeId = 2
      let servicesIds = this.selectedService && this.selectedService.length > 0 ? this.selectedService : [];
      let res = await this.otherLoanService.getOtherLoan(this.startIndex, this.fetchRecord, searchString, servicesIds, serviceTypeId, null, this.token);
      if (res && res.status == 200) {
        this.otherLoans = res.recordList;

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

  public async insertUpdateotherLoan() {
    try {
      if (this.otherLoanform.valid) {
        this.spinnerService.show();
        let id = this.otherLoan.id;
        let userId = this.otherLoan.userId ? this.otherLoan.userId : null;
        this.otherLoan = this.otherLoanform.value;
        this.otherLoan.id = id;
        this.otherLoan.id = this.otherLoan.id ? this.otherLoan.id : null;
        this.otherLoan.userId = userId;
        this.otherLoan.addressline2 = this.otherLoan.addressline2 ? this.otherLoan.addressline2 : null;
        this.otherLoan.serviceTypeId = 2
        this.otherLoan.city = this.cities[this.cities.findIndex(c => c.id == this.otherLoanform.get('cityId').value)].name;
        let res = await this.otherLoanService.insertUpdateOtherLoanDetail(this.otherLoan, this.token);
        if (res && res.status == 200) {
          this.modalService.dismissAll();
          this.spinnerService.hide();
          await this.getOtherLoan();
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.otherLoanform.controls).forEach(key => {
          this.otherLoanform.controls[key].markAsTouched();
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
    this.otherLoanform.reset();
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
    this.title = "Insert Other Loan";
    this.otherLoan = new OtherLoan();
    this.isShowParentSelection = true;
    this.selectedOtherLoan = this.otherLoans;
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
    this.title = "Edit Other Loan"
    this.otherLoan = new OtherLoan();
    this.otherLoan = element;
    this.getCityByPincode(this.otherLoan.pincode, false)
    this.otherLoanform.setValue({
      "fullName": this.otherLoan.fullName,
      "birthdate": this.otherLoan.birthdate,
      "panCardNo": this.otherLoan.panCardNo,
      "aadhaarCardNo": this.otherLoan.aadhaarCardNo.replace(/\s/g, ""),
      "contactNo": this.otherLoan.contactNo,
      "monthlyincome": this.otherLoan.monthlyincome,
      "email": this.otherLoan.email,
      "employmentTypeId": this.otherLoan.employmentTypeId,
      "serviceId": this.otherLoan.serviceId,
      "addressline1": this.otherLoan.addressline1,
      "addressline2": this.otherLoan.addressline2,
      "pincode": this.otherLoan.pincode,
      "cityId": this.otherLoan?.cityId ? this.otherLoan.cityId : null,
    })
    this.selectedOtherLoan = this.otherLoans.filter(c => c.id != element.id);
  }

  public clearSearch() {
    this.searchString = null;
    this.selectedService = [];
    this.setPage(1);
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

  keyPressAlphanumeric(event) {
    let inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9 ]/.test(inp)) {
      // only alphabet a-z A-Z
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let serviceTypeId = 2
      let servicesIds = this.selectedService && this.selectedService.length > 0 ? this.selectedService : [];
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
    let fileName = 'OtherLoan_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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