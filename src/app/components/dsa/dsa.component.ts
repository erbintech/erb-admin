import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { elementAt } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Bank } from 'src/app/shared/models/bank';
import { Commission } from 'src/app/shared/models/commission';
import { commissionTemplate } from 'src/app/shared/models/commissionTemplate';
import { Dsa } from 'src/app/shared/models/dsa';
import { Services } from 'src/app/shared/models/service';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BadgeService } from 'src/app/shared/services/badges.service';
import { BankLoanService } from 'src/app/shared/services/bank-loan.service';
import { BankService } from 'src/app/shared/services/bank.service';
import { CommissionTemplateService } from 'src/app/shared/services/commission-template.service';
import { CommissionService } from 'src/app/shared/services/commissionType.service';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ServicesService } from 'src/app/shared/services/services.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-dsa',
  templateUrl: './dsa.component.html',
  styleUrls: ['./dsa.component.scss']
})

export class DsaComponent implements OnInit {
  public paginate: any;
  public commissionPaginate: any = {};
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public dsa: Dsa[] = new Array<Dsa>();
  public bank: Bank[] = new Array<Bank>();
  public isAlert: boolean;
  public alertType: string;//["success","danger","warning"]
  public alertMessage: string;
  public token: string;
  public services: Services[] = new Array<Services>();
  public dsaColumns = ['id', 'dsaCode', 'name', 'contactNo', 'city', 'totalApplication', 'loanAmontMonth', 'loanAmount', 'pending', 'badge', 'createdDate', 'status', 'isDelete', 'action'];
  public commissionColumn = ['id', 'bank', 'service', 'commissionType', 'commission', 'action'];
  public commission = new Commission();
  public searchString: string;
  public selectedCity = [];
  public selectedStatus: string;
  public commissionType = [];
  public commissionForm: FormGroup;
  public title: string;
  public bankGetCommission: number;
  public showCommission: number;
  public selectedDsa = [];
  public commissionTemplates: commissionTemplate[] = new Array<commissionTemplate>();
  public isSelected: boolean
  public partner: any
  public commissions = [];
  isCommissionError: boolean;
  public badges = [];
  public isCommission: boolean
  public badgeId = new FormControl();
  public selectedBadge: number
  public isDelete: string;
  public dateFrom: Date
  public dateTo: Date
  public status = [{
    "id": 1,
    "name": "Approved"
  },
  {
    "id": 2,
    "name": "DisApproved"
  }]
  public isVerified: boolean = false;

  public userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public isFlag: boolean = true;
  public bankLoans = [];
  public templates = [];

  constructor(
    private commissionService: CommissionService,
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private paginationService: PaginationService,
    private dsaService: DsaService,
    private router: Router,
    private loanservice: ServicesService,
    private bankService: BankService,
    private toastrService: ToastrService,
    private commissionTemplateService: CommissionTemplateService,
    private badgeService: BadgeService,
    private bankLoanService: BankLoanService,
    public toggleMenuService: ToggleMenuService
  ) {
    this.commissionForm = formBuilder.group({
      'bankId': [null, [Validators.required]],
      'serviceId': [null, [Validators.required]],
      'commissionTypeId': [null, [Validators.required]],
      'commission': [null, [Validators.required, Validators.max(100)]],
    })
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this.userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this.userPagePermission.findIndex(c => c.name == 'dsa');
      if (ind >= 0) {
        let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
        this.isReadPermission = (roleId == 1) ? true : this.userPagePermission[ind].readPermission;
        this.isWritePermission = (roleId == 1) ? true : this.userPagePermission[ind].writePermission;
        this.isEditPermission = (roleId == 1) ? true : this.userPagePermission[ind].editPermission;
        this.isDeletePermission = (roleId == 1) ? true : this.userPagePermission[ind].deletePermission;
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
    await this.getServices();
    await this.getBank();
    await this.getCommissionType()
    await this.getBadges();
  }

  public async getBankLoans() {
    try {
      this.spinnerService.show();
      let res = await this.bankLoanService.getBankLoans(null, null, null, null, this.token);
      if (res && res.status == 200) {
        this.bankLoans = res.recordList;
        this.bankLoans.forEach(ele => {
          ele.bankServiceName = ele.bankName + "-" + ele.serviceName
        })
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

  public async getBadges() {
    try {
      this.spinnerService.show();
      let res = await this.badgeService.getBadges(null, null, this.token);
      if (res && res.status == 200) {
        this.badges = res.recordList;
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

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getDsa();
    }
  }

  public async getDsa(pageNumber?: number) {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let status = this.selectedStatus ? this.selectedStatus : null;
      let badgeId = this.selectedBadge ? this.selectedBadge : null;
      let isDelete = this.isDelete ? (this.isDelete == 'Yes' ? true : false) : null
      let res = await this.dsaService.getDsa(this.startIndex, this.fetchRecord, 'DSA', this.token, searchString, status, badgeId, isDelete, this.dateFrom, this.dateTo);
      if (res && res.status == 200) {
        this.dsa = res.recordList;
        if (this.dsa && this.dsa.length > 0) {
          for (let index = 0; index < this.dsa.length; index++) {
            this.dsa[index].code = this.dsa[index].permanentCode ? this.dsa[index].permanentCode : this.dsa[index].temporaryCode
            this.dsa[index].isDisabled = this.dsa[index].isDisabled ? true : false;
          }
        }

        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
      }
      if (this.dsa.length > 0) {
        this.isFlag = true
      } else {
        this.isFlag = false
      }
      // }
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

  public verifiedPartner(element, commissionModal) {
    let Verified = element.isDisabled ? 'approved' : 'disApproved'
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't " + Verified + " this DSA",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a927f9',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ' + Verified + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let isDisabled = !element.isDisabled
          if (!isDisabled) {
            this.partner = element
            this.isCommission = true;
            this.insertPartnerCommission(commissionModal);
          }
          else {
            let res = await this.dsaService.VerifiedDsa(element.id, element.userId, !element.isDisabled, element.permanentCode, element.temporaryCode, this.token);
            if (res && res.status == 200) {
              element.isDisabled = !element.isDisabled;
              this.getDsa();
              this.modalService.dismissAll();
              Swal.fire(
                Verified,
                'Successfully ' + Verified + " DSA",
                'success'
              )
              const modalContent = document.querySelector('.swal2-container');
              sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
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
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }


  public async insertPartnerCommission(commissionModal, ele?) {
    this.isCommissionError = false;
    this.commissions = [];
    this.isVerified = true;
    if (ele) {
      this.partner = new Dsa()
      this.partner.id = ele.id;
      this.isVerified = false;
    }
    this.title = "Insert Commission"
    this.commissionForm.reset();
    let res = await this.commissionService.getPartnerCommission(null, null, null, null, null, null, this.partner.id, this.token)
    if (res && res.status == 200) {
      this.commissions = res.recordList
      if (this.commissions && this.commissions.length > 0) {
        this.commissions.forEach(ele => {
          ele.serviceName = this.services.find(c => c.id == ele.serviceId).name
        })
      }
    }
    this.commission.partnerIds = [];
    this.showCommission = null;
    this.bankGetCommission = null;
    this.isSelected = false;
    this.commissionTemplates = [];
    this.isCommission = true;
    this.templates = [];
    // this.modalService.open(commissionModal, { size: 'xl' });
    this.modalService.open(commissionModal, { size: 'xl', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public clearSearch() {
    this.searchString = null;
    this.selectedCity = [];
    this.selectedStatus = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedBadge = null;
    this.isDelete = null;
    this.getDsa();
  }

  public async getBank() {
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

  public async getCommissionType() {
    try {
      this.spinnerService.show();
      let res = await this.commissionService.getCommissionType(null, null, this.token);
      if (res && res.status == 200) {
        this.commissionType = res.recordList;
        if (this.commissionType && this.commissionType.length > 0) {
          this.commissionType.forEach(ele => {
            if (ele.parentId) {
              ele.parentName = this.commissionType.find(c => c.id == ele.parentId).name;
            }
          });
        }
        this.commissionType = this.commissionType.filter(c => c.parentId != null)

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

  public async insertCommission(form) {
    try {
      this.spinnerService.show();
      if (!this.isCommissionError) {
        if (form.valid) {

          let commissionTemplateId = this.commission.commissionTemplateId
          let bankLoanCommissionId = this.commission.bankLoanCommissionId
          this.commission = this.commissionForm.value;
          this.commission.commissionTemplateId = commissionTemplateId
          this.commission.bankLoanCommissionId = bankLoanCommissionId
          this.commissions.push(this.commission);
        }
        if (this.commissions && this.commissions.length > 0) {
          let res = await this.commissionService.insertUpdatePartnerLoanCommission(this.partner.id, this.commissions, this.token)
          if (res && res.status == 200) {
            if (this.isVerified) {
              let res = await this.dsaService.VerifiedDsa(this.partner.id, this.partner.userId, !this.partner.isDisabled, this.partner.permanentCode, this.partner.temporaryCode, this.token);
              if (res && res.status == 200) {
                Swal.fire(
                  'Approved',
                  'Successfully ' + 'Approved' + " DSA",
                  'success'
                )
                const modalContent = document.querySelector('.swal2-container');
                sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
                this.partner.isDisabled = !this.partner.isDisabled;
              }
            }
            this.getDsa();
            this.modalService.dismissAll();
            this.toastrService.success("Successfully Set Commission")
          }
        }
        else {
          if (!form.valid) {
            Object.keys(form.controls).forEach(key => {
              form.controls[key].markAsTouched();
            });
          }
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


  public async getBankLoanCommission() {
    this.commission.partnerIds = [];
    this.selectedDsa = [];
    this.bankGetCommission = null;
    this.showCommission = null;

    if (this.commissionForm.get('bankId').value) {
      if (this.commissionForm.get('serviceId').value) {
        try {
          this.isCommissionError = false
          this.calculateCommission();
          this.spinnerService.show();
          let bankIds = [];
          let serviceIds = [];
          this.templates = [];
          bankIds.push(this.commissionForm.get('bankId').value)
          serviceIds.push(this.commissionForm.get('serviceId').value)
          let res = await this.commissionService.getCommission(null, null, bankIds, serviceIds, this.token);
          if (res && res.status == 200) {
            if (res.recordList && res.recordList.length > 0 && res.recordList[0].bankCommissions && res.recordList[0].bankCommissions.length > 0) {
              this.commission.bankLoanCommissionId = res.recordList[0].bankCommissions[0].id;
              this.bankGetCommission = res.recordList[0].bankCommissions[0].commission
              await this.getCommissionTemplate();
              let commissionTemplates = [];
              if (this.commissionTemplates && this.commissionTemplates.length > 0) {

                this.commissionTemplates.forEach(ele => {
                  if (ele.templates && ele.templates.length > 0) {
                    ele.templates.forEach(templateEle => {
                      if (templateEle && templateEle.commission >= this.bankGetCommission) {
                        commissionTemplates.push(templateEle)
                      }
                    })
                  }
                })
                this.templates = commissionTemplates
                this.templates = [...this.templates]
              }
            }
            else {
              Swal.fire({
                type: 'warning',
                text: "Please First Insert commission of " + this.services.find(c => c.id == this.commissionForm.get('serviceId').value).name + " Service of " + this.bank.find(c => c.id == this.commissionForm.get('bankId').value).name + " for admin",
              }
              )
              const modalContent = document.querySelector('.swal2-container');
              sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
              this.modalService.dismissAll();
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
    }
  }

  public closeDialog() {
    this.commissionForm.reset();
    this.modalService.dismissAll();
    this.showCommission = null;
    this.bankGetCommission = null;
    this.commission.partnerIds = [];
  }

  public calculateCommission() {
    if (this.commissionForm.get('commission').value) {
      if (this.commissionForm.get('commissionTypeId').value == 2) {
        this.showCommission = (this.commissionForm.get('commission').value * this.bankGetCommission) / 100
      }
      this.checkCommissionExist();
    }

  }

  public checkCommissionExist() {
    this.isCommissionError = false;
    if (this.commissionForm.get('commission').value) {
      if (this.commissionForm.get('commissionTypeId').value == 3) {
        if (this.commissionForm.get('commission').value > this.bankGetCommission)
          this.isCommissionError = true;
      }
      else if (this.commissionForm.get('commissionTypeId').value == 2) {
        if (this.showCommission) {
          if (this.showCommission > this.bankGetCommission)
            this.isCommissionError = true;
        }
      }

    }
  }

  public addPartnerForCommission(ele) {
    if (ele.isSelected) {
      let index = this.commission.partnerIds.findIndex(c => c == ele.id);
      if (index < 0) {
        this.commission.partnerIds.push(ele.id);
      }
    }
    else {
      let index = this.commission.partnerIds.findIndex(c => c == ele.id);
      if (index >= 0)
        this.commission.partnerIds.splice(index, 1);
    }
  }

  public async getCommissionTemplate() {
    try {
      this.spinnerService.show();
      let bankIds = [];
      let serviceIds = [];
      bankIds[0] = this.commissionForm.get("bankId").value;
      serviceIds[0] = this.commissionForm.get("serviceId").value;
      let res = await this.commissionTemplateService.getCommissionTemplate(null, null, bankIds, serviceIds, this.token);
      if (res && res.status == 200) {
        this.commissionTemplates = res.recordList;
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

  public warningAlert(dsa: Dsa) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Delete this DSA",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          dsa.partnerId = dsa.id;
          let res = await this.dsaService.deletePartnerByPartnerId(dsa.id, dsa.partnerId, this.token);
          if (res && res.status == 200) {
            this.getDsa();
            Swal.fire(
              'DELETE',
              'Successfully Deleted DSA',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
            // this.toastrService.success("DSA Deleted Successfully")
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


  public async addDsa() {
    this.router.navigate(['/dsa/add']);
  }

  public async editDsa(element: Dsa) {
    this.router.navigate(['/dsa/edit', element.id]);
  }

  public async viewDetail(element: Dsa) {
    this.router.navigate(["dsa/view", element.id]);
  }

  public async selectedTemplate(ele) {
    this.commissionTemplates.forEach(templateele => {
      if (templateele.id != ele.id)
        templateele.isSelected = false;
    });
    ele.isSelected = ele.isSelected ? false : true
    if (ele.isSelected) {
      this.isSelected = true;
      this.commissionForm.get("commissionTypeId").setValue(ele.commissionTypeId);
      this.commissionForm.get("commission").setValue(ele.commission);
      this.commission.commissionTemplateId = ele.id;
      await this.calculateCommission();

    }
    else {
      this.commissionForm.get("commissionTypeId").reset()
      this.commissionForm.get("commission").reset();
      this.isSelected = false;
      this.showCommission = null;
    }
  }

  public addMoreCommission(form) {
    if (!this.isCommissionError) {
      if (form.valid) {
        let commissionTemplateId = this.commission.commissionTemplateId
        let bankLoanCommissionId = this.commission.bankLoanCommissionId
        this.commission = this.commissionForm.value;
        this.commission.commissionTemplateId = commissionTemplateId
        this.commission.bankLoanCommissionId = bankLoanCommissionId
        this.commission.bankName = this.bank.find(c => c.id == this.commission.bankId).name
        this.commission.serviceName = this.services.find(c => c.id == this.commission.serviceId).name
        this.commission.commissionType = this.commissionType.find(c => c.id == this.commission.commissionTypeId).name
        this.commissions.push(this.commission);
        this.commissions = [...this.commissions]
        this.commission = new Commission();
        this.commissionForm.reset();
        this.commissionTemplates = [];
        this.bankGetCommission = null;
        this.showCommission = null;
        this.isSelected = false;
        // this.changeDetectorRefs.detectChanges();
        // let data = {
        //   commissionTypeId: this.commissionForm.get("commissionTypeId").value,
        //   commission: this.commissionForm.get("commission").value,
        //   bankId: this.commissionForm.get("bankId").value,
        //   serviceId: this.commissionForm.get("serviceId").value,
        //   bankLoanCommissionId:
        //   commissionTemplateId:
        // }
      }

      else {
        Object.keys(this.commissionForm.controls).forEach(key => {
          this.commissionForm.controls[key].markAsTouched();
        });
      }
    }
  }

  public deleteCommission(commisson, i: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Delete this commission?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.commissions.splice(i, 1);
        this.commissions = [...this.commissions]
      }
    });
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public changeBadge(element, commissionModal) {
    this.title = "change Badge"
    this.isCommission = false;
    // this.modalService.open(commissionModal)
    this.modalService.open(commissionModal, { windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.partner = element
    this.badgeId.setValue(this.badges.find(c => c.name == element.badgeName).id)
  }

  public async assignBadge() {
    if (this.badgeId) {
      try {
        this.spinnerService.show();
        let res = await this.dsaService.changeBadge(this.partner.id, this.badgeId.value, this.token)
        if (res && res.status == 200) {
          this.dsa[this.dsa.findIndex(c => c.id == this.partner.id)].badgeName = this.badges.find(c => c.id == this.badgeId.value).name
          this.spinnerService.hide();
          this.modalService.dismissAll();
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
    else {
      this.badgeId.markAsTouched();
    }
  }

  public async filterDsa() {
    this.startIndex = 0;
    this.fetchRecord = this.take
    this.activePage = 1;
    await this.getDsa();
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let status = this.selectedStatus ? this.selectedStatus : null;
      let badgeId = this.selectedBadge ? this.selectedBadge : null;
      let isDelete = this.isDelete ? (this.isDelete == 'Yes' ? true : false) : null
      let res = await this.dsaService.getDsa(null, null, 'DSA', this.token, searchString, status, badgeId, isDelete, this.dateFrom, this.dateTo);
      let dsa = [];
      if (res && res.status == 200) {
        dsa = res.recordList;
        if (dsa && dsa.length > 0) {
          for (let index = 0; index < dsa.length; index++) {
            dsa[index].code = dsa[index].permanentCode ? dsa[index].permanentCode : dsa[index].temporaryCode
          }
        }
      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(dsa);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['Code', 'Name', 'ContactNo', 'City', 'TotalApplication', 'LoanAmontMonth', 'LoanAmount', 'PendingApplication', 'Badge', 'createdDate', 'Status', 'isDelete']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'DSA_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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
      let totalApplication = array[j].totalApplicationReceived ? array[j].totalApplicationReceived : 0
      let thisMonthAmount = array[j].thisMonthAmount ? '₹' + array[j].thisMonthAmount.toFixed(2) : 0.00
      let totalAmount = array[j].totalAmount ? '₹' + array[j].totalAmount.toFixed(2) : 0
      let totalPending = array[j].totalPending ? array[j].totalPending : ''
      let status = array[j].isDisabled ? 'DisApproved' : 'Approved';
      let isDelete = array[j].isDelete ? 'Yes' : 'No'
      line += '\n' + (j + 1) + ',' + array[j].code + ',' + array[j].fullName + "," + array[j].contactNo + "," + array[j].cityName + ',' + totalApplication + ',' + thisMonthAmount + ',' + totalAmount + `,` + totalPending + ',' + array[j].badgeName + ',' + createdDate + ',' + status + ',' + isDelete

    }
    str += line + '\r\n';
    return str;
  }

}