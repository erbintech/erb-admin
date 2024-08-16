import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BankCreditCard } from 'src/app/shared/models/bankCreditCard';
import { BankCreditCardPolicy } from 'src/app/shared/models/bankCreditCardPolicy';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BankService } from 'src/app/shared/services/bank.service';
import { BankCreditCardService } from 'src/app/shared/services/bankCreditCard.service';
import { EmploymentTypeService } from 'src/app/shared/services/employmentType.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

@Component({
  selector: 'app-bank-credit-card-policy',
  templateUrl: './bank-credit-card-policy.component.html',
  styleUrls: ['./bank-credit-card-policy.component.scss']
})
export class BankCreditCardPolicyComponent implements OnInit {

  public alertMessage: string
  public token: string
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  public paginate: any;
  public title: string
  public bankCreditCards: BankCreditCard[] = new Array<BankCreditCard>();
  public bankCreditCardPolicy = new BankCreditCardPolicy();
  public bankCreditCardPolicies: BankCreditCardPolicy[] = new Array<BankCreditCardPolicy>();
  public employmentTypes = [];
  public bankCreditCardForm: FormGroup
  public companyCategoryTypes = [];
  public displayColumns = ['id', 'bankName', 'creditCardName', 'employmentType', 'age', 'cibilScore', 'companyCategoryType', 'minIncome', 'createdDate', 'action']
  public banks = [];
  public selectedBank: number
  public selectedCompanyCategory: number
  public minAge: number
  public maxAge: number
  public minCibilScore: number
  public selectedEmploymentType: number
  public isRequired: boolean = true;

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private bankservice: BankService,
    private modalService: NgbModal,
    private bankCreditCardService: BankCreditCardService,
    private employmentTypeService: EmploymentTypeService,
  ) {
    this.bankCreditCardForm = formBuilder.group({
      "bankCreditCardId": [null, [Validators.required]],
      "employmentTypeId": [null, [Validators.required]],
      "minimumCibilScore": [null, [Validators.required]],
      "minAge": [null, [Validators.required]],
      "maxAge": [null, [Validators.required]],
      "minIncome": [null, [Validators.required]],
      "companyCategoryTypeId": [null],
    })
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'bankCreditCardPolicy');
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
    await this.getCompanyCategoryType();
    await this.getBankCreditCard();
    this.getBanks();
  }

  public async getBanks() {
    try {
      this.spinnerService.show();
      let res = await this.bankservice.getBanks(null, null, null, this.token);
      if (res && res.status == 200) {
        this.banks = res.recordList;
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

  public async getBankCreditCard() {
    try {
      this.spinnerService.show();
      let res = await this.bankCreditCardService.getBankCredtiCard(this.startIndex, this.fetchRecord, null, this.token);
      if (res && res.status == 200) {
        this.bankCreditCards = res.recordList;
        if (this.bankCreditCards && this.bankCreditCards.length > 0) {
          this.bankCreditCards.forEach(ele => {
            ele.bankCreditCardName = ele.bankName + "-" + ele.creditCardName
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
      this.toastrService.error(this.alertMessage)
    }
  }

  public async getCompanyCategoryType() {
    try {
      this.spinnerService.show();
      let res = await this.bankCreditCardService.getCompanyCategoryTypes(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.companyCategoryTypes = res.recordList;
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
      await this.getBankCreditCardPolicy();
    }
  }

  public async getBankCreditCardPolicy() {
    try {

      this.spinnerService.show();
      this.minAge = this.minAge ? this.minAge : null;
      this.maxAge = this.maxAge ? this.maxAge : null;
      this.selectedBank = this.selectedBank ? this.selectedBank : null;
      this.selectedCompanyCategory = this.selectedCompanyCategory ? this.selectedCompanyCategory : null;
      this.minCibilScore = this.minCibilScore ? this.minCibilScore : null;
      this.selectedEmploymentType = this.selectedEmploymentType ? this.selectedEmploymentType : null;
      let res = await this.bankCreditCardService.getBankCredtiCardPolicy(this.startIndex, this.fetchRecord, this.selectedBank, this.selectedCompanyCategory, this.minAge, this.maxAge, this.minCibilScore, this.selectedEmploymentType, this.token);
      if (res && res.status == 200) {
        this.bankCreditCardPolicies = res.recordList
      }
      this.count = res.totalRecords;
      this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
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
      this.spinnerService.show();
      let res = await this.employmentTypeService.getEmploymentType(this.token);
      if (res && res.status == 200) {
        this.employmentTypes = res.recordList;
        if (this.employmentTypes && this.employmentTypes.length > 0) {
          this.employmentTypes.forEach(ele => {
            if (ele.parentId) {
              let index = this.employmentTypes.findIndex(c => c.id == ele.parentId);
              ele.parentName = this.employmentTypes[index].name;
              this.employmentTypes[index].isParent = true;
            }
          });
        }
        this.employmentTypes = this.employmentTypes.filter(c => c.isParent != true);
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

  public modalOpen(basicmodal) {
    this.title = "Add Bank Credit Card Policy";
    this.bankCreditCardPolicy = new BankCreditCardPolicy();
    this.bankCreditCardForm.reset();
    // this.modalService.open(basicmodal, { size: "lg" })
    this.modalService.open(basicmodal, {size: 'lg',windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public async insertBankCreditCardPolicy(form) {
    if (form.valid) {
      try {
        this.spinnerService.show();
        let id = this.bankCreditCardPolicy.id ? this.bankCreditCardPolicy.id : null;
        this.bankCreditCardPolicy = this.bankCreditCardForm.value;
        this.bankCreditCardPolicy.id = id;
        let res = await this.bankCreditCardService.insertBankCreditCardPolicy(this.bankCreditCardPolicy, this.token);
        if (res && res.status == 200) {
          await this.getBankCreditCardPolicy();
          this.modalService.dismissAll();
          this.toastrService.success("SuccessFully Insert Bank Credit Card Policy")
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
    else {
      Object.keys(this.bankCreditCardForm.controls).forEach(key => {
        this.bankCreditCardForm.controls[key].markAsTouched();
      });
    }
  }

  public editDialog(element, basicmodal) {
    this.title = "Edit Bank CreditCard Policy";
    this.bankCreditCardPolicy = element;
    this.bankCreditCardForm.setValue({
      "bankCreditCardId": element.bankCreditCardId,
      "employmentTypeId": element.employmentTypeId,
      "minimumCibilScore": element.minimumCibilScore,
      "minAge": element.minAge,
      "maxAge": element.maxAge,
      "minIncome": element.minIncome,
      "companyCategoryTypeId": element.companyCategoryTypeId ? element.companyCategoryTypeId : null
    });
    // this.modalService.open(basicmodal, { size: 'lg' })
    this.modalService.open(basicmodal, {size: 'lg',windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public closeDialog() {
    this.bankCreditCardPolicy = new BankCreditCardPolicy();
    this.modalService.dismissAll();
  }

  public async clearSearch() {
    this.selectedBank = null;
    this.selectedCompanyCategory = null;
    this.minAge = null;
    this.maxAge = null;
    this.selectedEmploymentType = null;
    this.minCibilScore = null;
    await this.getBankCreditCardPolicy();
  }
}