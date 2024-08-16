import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { Cities } from 'src/app/shared/models/cities';
import { Customer } from 'src/app/shared/models/customer';
import { Dsa } from 'src/app/shared/models/dsa';
import { AdminPersonalLoanResponse } from 'src/app/shared/models/loans/adminPersonalLoanResponse';
import { OtherLoan } from 'src/app/shared/models/other-loan';
import { Services } from 'src/app/shared/models/service';
import { ServiceType } from 'src/app/shared/models/servicetype';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BusinessLoanService } from 'src/app/shared/services/businessLoan.service';
import { CreditCardService } from 'src/app/shared/services/credit-card.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { HomeLoanService } from 'src/app/shared/services/homeLoan.service';
import { LoanStatusService } from 'src/app/shared/services/loanStatus.service';
import { OtherLoanService } from 'src/app/shared/services/other-Loan.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { PersonalLoanService } from 'src/app/shared/services/personalLoan.service';
import { ServicesService } from 'src/app/shared/services/services.service';
import { ServicetypeService } from 'src/app/shared/services/servicetype.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
import { TrainingService } from 'src/app/shared/services/training.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  public searchString: string;
  public token: string
  public alertMessage: string;
  public commissionForm: FormGroup;
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  private startIndex: number;
  private fetchRecord: number;
  public title: string;
  public user: Users = new Users();
  public customers: Customer[] = new Array<Customer>();
  public customerColumns = ['id', 'code', 'name', 'contact', 'city', 'state', 'birthDate', 'gender', 'customerGroup', 'partner', "isDelete", 'createdDate', 'action'];
  public services: Services[] = new Array<Services>();
  public serviceTypes: ServiceType[] = new Array<ServiceType>();
  public serviceType = new ServiceType();
  public selectedCustomerId: number;
  public selectedUserId: number;
  public isSelectService: boolean = false;
  public isListService: boolean = false;
  public isListServiceType: boolean = false;
  public customerServices = [];
  public otherservices = [];
  public displayColumns = ["id", "LoanAmount", "Employment", "Income", "Status", "DSACode", "rmFullName", "Action"];
  public displayColumnsServiceType = ["id", "aadhaarCardNo", "panCardNo", "pincode", "city", "monthlyincome", "birthdate", "Action"]
  public displayCreditCardColumns = ["id", "employmentType", "panCardNo", "applyDate", "status", "action"]
  public selectedServiceId: number;
  public selectedServiceTypeId: number;
  public userId: number
  public selectedRoles = [];
  public roles = [];
  public dateFrom: Date
  public dateTo: Date
  public otherLoans: OtherLoan[] = new Array<OtherLoan>();
  public otherLoan: any = new OtherLoan();
  public isShowParentSelection: boolean = true;
  public selectedOtherLoan = [];
  public isAlert: boolean;
  public alertType: string;
  public cities: Cities[] = new Array<Cities>();
  public dsas: Dsa[] = new Array<Dsa>();
  public dsa = new Dsa();
  public employments: OtherLoan[] = new Array<OtherLoan>();
  public service: OtherLoan[] = new Array<OtherLoan>();
  public selectedServiceTypes = [];
  public isCreditCardService: boolean
  public panCardNo: string;
  public isDelete: string;
  public paramrolename: string;
  public userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public isAllowAddNewService: boolean = false;
  public isAdminVerificationRequired: boolean;
  public remainingString: number;
  public cityIds = [];
  public stateIds = [];
  public filterCities = [];
  public states = [];
  public pincode: number
  public serviceIds = [];
  public statusIds = [];
  public statuses = [];
  public isFlag: boolean = true;

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private paginationService: PaginationService,
    private router: Router,
    private toastrService: ToastrService,
    private servicesService: ServicesService,
    private servicetypeService: ServicetypeService,
    private personalLoanService: PersonalLoanService,
    private businessLoanService: BusinessLoanService,
    private homeLoanService: HomeLoanService,
    private trainingService: TrainingService,
    private otherLoanService: OtherLoanService,
    private dsaService: DsaService,
    private creditCardService: CreditCardService,
    private actRoute: ActivatedRoute,
    private loanStatusService: LoanStatusService,
    private ngZone: NgZone,
    public toggleMenuService: ToggleMenuService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this.userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this.userPagePermission.findIndex(c => c.name == 'customers');
      if (ind >= 0) {
        let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
        this.isReadPermission = (roleId == 1) ? true : this.userPagePermission[ind].readPermission;
        this.isWritePermission = (roleId == 1) ? true : this.userPagePermission[ind].writePermission;
        this.isEditPermission = (roleId == 1) ? true : this.userPagePermission[ind].editPermission;
        this.isDeletePermission = (roleId == 1) ? true : this.userPagePermission[ind].deletePermission;
        this.isAdminVerificationRequired = (roleId == 1) ? true : this.userPagePermission[ind].deletePermission;
      }
    } else {
      let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
      this.isReadPermission = (roleId == 1) ? true : false;
      this.isWritePermission = (roleId == 1) ? true : false;
      this.isEditPermission = (roleId == 1) ? true : false;
      this.isDeletePermission = (roleId == 1) ? true : false;
      this.isAdminVerificationRequired = (roleId == 1) ? true : false;
    }
  }
  // ngAfterViewInit() {
  //   this.ngZone.onMicrotaskEmpty.pipe(take(3)).subscribe(() => this.table.updateStickyColumnStyles());
  //   }
  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    await this.getRoles();
    await this.setPage(1);
    await this.getServices();
    await this.getServiceType();
    await this.getServicesByServiceTypeId();
    await this.getEmploymentTypes();
    await this.getStates();
    await this.getLoanStatuses();

    this.userId = JSON.parse(JSON.stringify(sessionStorage.getItem("Credential"))).userId

    this.paramrolename = this.actRoute.snapshot.paramMap.get('roleName');
    this.dsa.roleName = this.paramrolename;
    this.paramrolename = this.dsa.roleName;
  }


  otherLoanform = new FormGroup({
    'fullName': new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]),
    'birthdate': new FormControl(null, Validators.required),
    'panCardNo': new FormControl(null, [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    'aadhaarCardNo': new FormControl('', [Validators.required, Validators.pattern('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')]),
    'contactNo': new FormControl(null, [Validators.required, Validators.minLength(10)]),
    'monthlyincome': new FormControl(0, Validators.required),
    'email': new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    'employmentTypeId': new FormControl(0, Validators.required),
    'serviceId': new FormControl(0, Validators.required),
    'addressline1': new FormControl('', Validators.required),
    'addressline2': new FormControl(''),
    'pincode': new FormControl(null, Validators.required),
    'cityId': new FormControl(0, Validators.required),
  })

  public async onKeyUpEvent(event: any, isChangeCity, isFilter) {
    try {
      if (event.target.value && event.target.value.length == 6) {
        await this.getCityByPincode(event.target.value, isChangeCity, isFilter);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async getLoanStatuses() {
    try {
      let res = await this.loanStatusService.getLoanStatus(this.token);
      if (res && res.status == 200) {
        this.statuses = res.recordList;
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

  public async getStates() {
    try {
      let res = await this.customerService.getStates(this.token);
      if (res && res.status == 200) {
        this.states = res.recordList;
      }
    }
    catch (error) {
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
      this.toastrService.error(error)
    }
  }

  public async getCityByPincode(n, isChangeCity, isFilter) {
    try {
      let res = await this.dsaService.getCityByPincode(null, n, this.token);
      if (res && res.status == 200) {
        if (isFilter) {
          this.filterCities = res.recordList
          this.cityIds[0] = this.filterCities[0].id
        }
        else {
          this.cities = res.recordList;
          this.otherLoan.city = this.cities[0].name;
          if (isChangeCity) {
            this.otherLoanform.get("cityId").setValue(this.cities[0].id)
          }
        }
      }
      this.spinnerService.hide();
    } catch (error) {
      console.log(error)
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = 'Please enter valid Pincode'
      }
      if (error?.error && error.error.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error && error.error.error && error.error.error.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
      this.isAlert = true;
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public async getServicesByServiceTypeId() {
    try {
      let serviceTypeId = 2
      let res = await this.otherLoanService.getServicesByServiceTypeId(serviceTypeId, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.service = res.recordList;
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
          this.roles = this.roles.filter(c => c.name == "DSA" || c.name == "SUBDSA" || c.name == "CONNECTOR" || c.name == "EMPLOYEE" || c.name == "ADMINISTRATOR")
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
      await this.getCustomer();
    }
  }

  public async getCustomer() {
    try {
      this.spinnerService.show();

      this.searchString = this.searchString ? this.searchString : null;
      let isDelete = this.isDelete ? (this.isDelete == 'Yes' ? true : false) : null
      let res = await this.customerService.getCustomer(this.startIndex, this.fetchRecord, null, this.token, this.selectedRoles, this.searchString, this.dateFrom, this.dateTo, isDelete, this.cityIds, this.stateIds, this.serviceIds, this.statusIds);
      if (res && res.status == 200) {
        this.customers = res.recordList;
        if (this.customers && this.customers.length > 0) {
          for (let index = 0; index < this.customers.length; index++) {
            this.customers[index].code = this.customers[index].permanentCode ? this.customers[index].permanentCode : this.customers[index].temporaryCode
          }
        }
        if (this.customers.length > 0) {
          this.isFlag = true
        } else {
          this.isFlag = false
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

  public async getServices() {
    try {
      this.spinnerService.show();
      let res = await this.servicesService.getServices(null, null, this.token);
      if (res && res.status == 200) {
        this.services = res.recordList;
        this.services = this.services.filter(c => (c.name == 'Personal Loan' || c.name == 'Instant Loan' || c.name == 'Business Loan' || c.name == 'Home Loan' || c.name == 'Mortgage/LAP' || c.name == 'Credit Card'))
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

  public async getServiceType() {
    try {
      this.spinnerService.show();
      let res = await this.servicetypeService.getServicetype(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.serviceTypes = res.recordList;
        this.serviceTypes = this.serviceTypes.filter(c => (c.name == 'Other Loan' || c.name == 'Other Services'))
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

  public warningAlert(customers: Customer) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Delete this Customer",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          customers.customerId = customers.id;
          let res = await this.customerService.deleteCustomerById(customers.id, customers.customerId, this.token);
          if (res && res.status == 200) {
            this.getCustomer();
            Swal.fire(
              'DELETE',
              'Successfully Deleted Customer',
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
          this.toastrService.error(this.alertMessage);
        }
      }
    });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.remove('dark-only-modal')
    }
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public async addCustomer() {
    this.router.navigate(['/customer/add']);
  }

  public selectServiceModal(user: Customer, serviceModal) {
    this.isSelectService = true;
    this.isListService = false;
    this.isListServiceType = false;
    this.selectedUserId = user.userId;
    this.selectedCustomerId = user.id
    // this.modalService.open(serviceModal);
    this.modalService.open(serviceModal, { windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public navigateAddLoanPage(service: any) {
    let customerLoanId = sessionStorage.getItem("customerLoanId");
    if (customerLoanId)
      sessionStorage.removeItem("customerLoanId")
    let name = this.services[this.services.findIndex(c => c.id == this.selectedServiceId)].name;
    if (name == "Mortgage/LAP") {
      this.modalService.dismissAll()
      this.router.navigate(["/lap/add", this.selectedCustomerId]);
    }
    else {
      service.name = this.services[this.services.findIndex(c => c.id == this.selectedServiceId)].name.replace(/\s/g, '-')
      let route = service.name.toLowerCase() + '/add/' + this.selectedCustomerId;
      this.modalService.dismissAll()
      this.router.navigate([route]);
    }
  }

  public navigateEditLoanPage(customerloan: AdminPersonalLoanResponse) {
    let customerLoanId = sessionStorage.getItem("customerLoanId");
    if (customerLoanId)
      sessionStorage.removeItem("customerLoanId")
    let ServiceName = this.services[this.services.findIndex(c => c.id == this.selectedServiceId)].name;
    if (ServiceName == "Mortgage/LAP") {
      this.modalService.dismissAll()
      this.router.navigate(["/lap/edit", this.selectedCustomerId, customerloan.basicDetail.customerLoanId]);
    }
    else {
      let name = this.services[this.services.findIndex(c => c.id == this.selectedServiceId)].name.replace(/\s/g, '-')
      let route = name.toLowerCase() + '/edit/' + this.selectedCustomerId + "/" + customerloan.basicDetail.customerLoanId;
      this.modalService.dismissAll()
      this.router.navigate([route]);
    }
  }
  // public navigateAddCreditCardPage() {
  //   this.router.navigate(["/credit-card/add", this.selectedCustomerId])
  // }

  public async getList(service, serviceModal) {
    try {
      this.isAllowAddNewService = true;
      this.isCreditCardService = false;
      this.selectedServiceId = service.id
      let dt1 = null
      let dt2 = null;
      let days = null;
      if (service.id == 2) {
        let res = await this.businessLoanService.getBusinessLoans(service.id, this.selectedCustomerId, null, null, this.token);
        if (res && res.status == 200) {
          this.customerServices = res.recordList;
          this.customerServices = this.customerServices.filter(c => c.basicDetail.isDelete == 0)
          if (this.customerServices && this.customerServices.length > 0) {

            if (this.customerServices[0].basicDetail.isDelete == 0) {
              if (this.customerServices[0].basicDetail.status == 'REJECTED') {
                dt1 = new Date(this.customerServices[0].loanStatuses.transactionDate);
                dt2 = new Date();
                days = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
              }
            }
          }
          if (days >= 90 || days == null) {
            this.isAllowAddNewService = true
          }
          else {
            this.isAllowAddNewService = false;
            this.remainingString = 90 - days;
          }
          this.isListService = true;
        }
      }
      else if (service.id == 7 || service.id == 9) {
        let res = await this.homeLoanService.getHomeLoans(service.id, this.selectedCustomerId, null, null, this.token);
        if (res && res.status == 200) {
          this.customerServices = res.recordList;
          this.customerServices = this.customerServices.filter(c => c.basicDetail.isDelete == 0)
          if (this.customerServices && this.customerServices.length > 0) {

            if (this.customerServices[0].basicDetail.isDelete == 0) {
              if (this.customerServices[0].basicDetail.status == 'REJECTED') {

                dt1 = new Date(this.customerServices[0].loanStatuses.transactionDate);
                dt2 = new Date();
                days = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
              }
            }
          }
          if (days >= 90 || days == null) {
            this.isAllowAddNewService = true
          }
          else {
            this.isAllowAddNewService = false;
            this.remainingString = 90 - days;
          }
          this.isListService = true;
        }
      }
      else if (service.id == 12) {
        let res = await this.creditCardService.getCreditCard(null, null, null, null, this.selectedCustomerId, this.token);
        this.customerServices = res.recordList
        this.panCardNo = this.customers.find(c => c.id == this.selectedCustomerId).panCardNo
        this.isListService = true;
        this.isCreditCardService = true;
      }
      else {
        let res = await this.personalLoanService.getPersonalLoans(service.id, this.selectedCustomerId, null, null, this.token)
        if (res && res.status == 200) {
          this.customerServices = res.recordList;
          this.customerServices = this.customerServices.filter(c => c.basicDetail.isDelete == 0)
          if (this.customerServices && this.customerServices.length > 0) {

            if (this.customerServices[0].basicDetail.isDelete == 0) {
              if (this.customerServices[0].basicDetail.status == 'REJECTED') {
                dt1 = new Date(this.customerServices[0].loanStatuses.transactionDate);
                dt2 = new Date();
                days = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
              }
            }
          }
          if (days >= 90 || days == null) {
            this.isAllowAddNewService = true
          }
          else {
            this.isAllowAddNewService = false;
            this.remainingString = 90 - days;
          }
          this.isListService = true;
        }
      }
      this.modalService.dismissAll();
      this.isSelectService = false;
      this.isListService = true;
      // this.modalService.open(serviceModal, { size: 'lg' })
      this.modalService.open(serviceModal, { size: 'lg', windowClass: 'custom-modal' });
      if (sessionStorage.getItem('dark-mode') == 'dark-only') {
        const modalContent = document.querySelector('.custom-modal .modal-content');
        modalContent.classList.add('dark-only-modal')
      }
      else {
        const modalContent = document.querySelector('.custom-modal .modal-content');
        modalContent.classList.remove('dark-only-modal')
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

  public async getListServiceType(serviceType, serviceModal) {
    try {
      this.selectedServiceTypeId = serviceType.id;
      if (serviceType.id) {
        let servicesIds = this.selectedOtherLoan ? this.selectedOtherLoan : [];
        let res = await this.otherLoanService.getOtherLoan(null, null, null, servicesIds, serviceType.id, this.selectedUserId, this.token);
        if (res && res.status == 200) {
          this.otherservices = res.recordList;
          this.isListServiceType = true;
        }
      }
      this.modalService.dismissAll();
      this.isSelectService = false;
      this.isListServiceType = true;
      // this.modalService.open(serviceModal, { size: 'lg' })
      this.modalService.open(serviceModal, { size: 'lg', windowClass: 'custom-modal' });
      if (sessionStorage.getItem('dark-mode') == 'dark-only') {
        const modalContent = document.querySelector('.custom-modal .modal-content');
        modalContent.classList.add('dark-only-modal')
      }
      else {
        const modalContent = document.querySelector('.custom-modal .modal-content');
        modalContent.classList.remove('dark-only-modal')
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

  public async modalOpen(basicmodal: any) {
    this.otherLoanform.reset();
    this.modalService.dismissAll();
    if (this.selectedServiceTypeId == 3) {
      this.title = "Insert Other Service";
    } else {
      this.title = "Insert Other Loan";
    }
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
    this.otherLoan = new OtherLoan();
    this.otherLoan.serviceTypeId = this.selectedServiceTypeId;
    this.isShowParentSelection = true;
    this.selectedOtherLoan = this.otherLoans;
    let customer = this.customers.find(c => c.id == this.selectedCustomerId);
    if (customer.pincode) {
      await this.getCityByPincode(customer.pincode, false, false)
    }
    this.otherLoanform.setValue({
      'fullName': customer.fullName,
      'birthdate': customer.birthdate ? customer.birthdate : null,
      'panCardNo': customer.panCardNo ? customer.panCardNo : null,
      'aadhaarCardNo': customer.aadhaarCardNo ? customer.aadhaarCardNo.replace(/\s/g, "") : null,
      'contactNo': customer.contactNo,
      'monthlyincome': customer.monthlyincome ? customer.monthlyincome : null,
      'email': customer.email ? customer.email : null,
      'employmentTypeId': customer.employmentTypeId ? customer.employmentTypeId : null,
      'serviceId': null,
      'addressline1': customer.addressline1 ? customer.addressLine1 : null,
      'addressline2': customer.addressline2 ? customer.addressLine2 : null,
      'pincode': customer.pincode ? customer.pincode : null,
      'cityId': customer.cityId ? customer.cityId : null
    });

  }

  public editDialog(element: OtherLoan, basicmodal) {
    this.otherLoan.serviceTypeId = this.selectedServiceTypeId;
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
    this.getCityByPincode(this.otherLoan.pincode, false, false)
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

  public async insertUpdateotherLoan() {
    try {
      if (this.otherLoanform.valid) {
        this.spinnerService.show();
        let id = this.otherLoan.id;
        this.otherLoan = this.otherLoanform.value;
        this.otherLoan.id = id;
        this.otherLoan.serviceTypeId = this.selectedServiceTypeId;
        this.otherLoan.userId = this.selectedUserId;
        this.otherLoan.addressline2 = this.otherLoan.addressline2 ? this.otherLoan.addressline2 : null
        this.otherLoan.city = this.cities[this.cities.findIndex(c => c.id == this.otherLoanform.get('cityId').value)].name;
        let res = await this.otherLoanService.insertUpdateOtherLoanDetail(this.otherLoan, this.token);
        if (res && res.status == 200) {
          this.modalService.dismissAll();
          this.spinnerService.hide();
          if (this.otherLoan.serviceTypeId == 2) {
            this.router.navigateByUrl('/otherLoan');
          }
          else {
            this.router.navigateByUrl('/otherService');
          }
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

  public navigateEditCreditCardPage(ele) {
    let route = "/credit-card/edit/" + this.selectedCustomerId + "/" + ele.id
    this.router.navigate([route])
    this.modalService.dismissAll();
  }

  public closeDialog() {
    this.modalService.dismissAll();
  }

  public navigateEditCustomer(ele: any) {
    this.router.navigate(['/customer/edit', ele.id])
  }

  public navigateViewDetail(ele: any) {
    this.router.navigate(['/customer/view', ele.id])
  }

  public navigatePartnerViewDetail(ele: any) {
    if (ele.customerGroup == 'DSA') {
      this.router.navigate(["dsa/view", ele.partnerId]);
    } else
      if (ele.customerGroup == 'SUBDSA') {
        this.router.navigate(["subdsa/view", ele.partnerId]);
      } else
        if (ele.customerGroup == 'CONNECTOR') {
          this.router.navigate(["connector/view", ele.partnerId]);
        }
        else
          if (ele.customerGroup == 'EMPLOYEE') {
            this.router.navigate(["employee/view", ele.partnerId]);
          }
  }

  public clearSearch() {
    this.selectedRoles = [];
    this.searchString = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.isDelete = null;
    this.cityIds = [];
    this.filterCities = [];
    this.stateIds = [];
    this.pincode = null;
    this.statusIds = [];
    this.serviceIds = [];
    this.getCustomer();
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

  public async filterCustomer() {
    this.startIndex = 0;
    this.fetchRecord = this.take
    this.activePage = 1;
    await this.getCustomer();
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      this.searchString = this.searchString ? this.searchString : null;
      let isDelete = this.isDelete ? (this.isDelete == 'Yes' ? true : false) : null
      let res = await this.customerService.getCustomer(null, null, null, this.token, this.selectedRoles, this.searchString, this.dateFrom, this.dateTo, isDelete, this.cityIds, this.stateIds, this.serviceIds, this.statusIds);
      let customers = [];
      if (res && res.status == 200) {
        customers = res.recordList;
        if (customers && customers.length > 0) {
          for (let index = 0; index < customers.length; index++) {
            customers[index].code = customers[index].permanentCode ? customers[index].permanentCode : customers[index].temporaryCode
          }
        }
      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(customers);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['code', 'Name', 'Contact', 'birthDate', 'Gender', 'Group', 'Partner', 'createdDate']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'Customer_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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
      let bDate = '';
      if (array[j].birthdate) {
        bDate = new Date(array[j].birthdate).getFullYear() + "-" + ("0" + (new Date(array[j].birthdate).getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date(array[j].birthdate).getDate())).slice(-2);
      }
      let createdDate = '';
      if (array[j].createdDate) {
        createdDate = new Date(array[j].createdDate).getFullYear() + "-" + ("0" + (new Date(array[j].createdDate).getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date(array[j].createdDate).getDate())).slice(-2);
      }
      let gender = array[j].gender ? array[j].gender : ''
      let partner = array[j].partnerName ? (array[j].partnerName + '-' + array[j].partnerContactNo) : ''
      line += '\n' + (j + 1) + ',' + array[j].code + "," + array[j].fullName + "," + array[j].contactNo + ',' + bDate + ',' + gender + ',' + array[j].customerGroup + ',' + partner + ',' + createdDate

    }
    str += line + '\r\n';
    return str;
  }

}