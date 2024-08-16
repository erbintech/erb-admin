import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { elementAt } from 'rxjs';
import { Bank } from 'src/app/shared/models/bank';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BankService } from 'src/app/shared/services/bank.service';
import { BankCreditCardService } from 'src/app/shared/services/bankCreditCard.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private isShowParentSelection: boolean = true;
  private selectedBank = [];
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;

  public user: Users = new Users();
  public title: string;
  public displayColumns = ["id", "bankLogo", "name", "description", "headquarters", "bankCode", "Status", "createdDate", "Action"];
  public banks: Bank[] = new Array<Bank>();
  public bank: any = new Bank();
  public paginate: any;
  public searchString: string;
  public companyCategoryTypes = [];
  public companyCategoryType: number

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public companyCategory = [];
  public selectedCategory = [];
  public searchSelectedCategory = [];

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private bankService: BankService,
    private modalService: NgbModal,
    private bankCreditCardService: BankCreditCardService,
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'bank');
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
    this.getCompanyCategoryType();
    this.getCompanyCategory();
    await this.setPage(1);
  }

  bankform = new FormGroup({
    'name': new FormControl('', Validators.required),
    "description": new FormControl(''),
    "headquarters": new FormControl(''),
    "bankCode": new FormControl(''),
    "minAge": new FormControl(''),
    "maxAge": new FormControl(null),
    "bankLogo": new FormControl('')
  });

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getBanks();
    }
  }

  public async getBanks() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.bankService.getBanks(this.startIndex, this.fetchRecord, searchString, this.token);
      if (res && res.status == 200) {
        this.banks = res.recordList;

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

  public async insertBank() {
    try {
      if (this.bankform.valid) {
        this.spinnerService.show();
        if (this.bank.id) {
          let id = this.bank.id;
          let companyCategoryType = this.bank.companyCategoryTypes ? this.bank.companyCategoryTypes : [];;
          this.bank = this.bankform.value;
          this.bank.id = id;
          this.bank.description = this.bank.description || null;
          this.bank.headquarters = this.bank.headquarters || null;
          this.bank.bankCode = this.bank.bankCode || null;
          this.bank.minAge = this.bank.minAge || null;
          this.bank.maxAge = this.bank.maxAge || null;
          this.bank.companyCategoryTypes = companyCategoryType;
          if (this.bank.bankLogo && !this.bank.bankLogo.includes("https:")) {
            let bankLogo = this.bank.bankLogo.split(',')[1];
            this.bank.bankLogo = bankLogo
          }
          let res = await this.bankService.updateBank(this.bank, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getBanks();
          }
        }
        else {
          let companyCategoryType = this.bank.companyCategoryTypes ? this.bank.companyCategoryTypes : [];;
          this.bank = this.bankform.value;
          this.bank.description = this.bank.description || null;
          this.bank.headquarters = this.bank.headquarters || null;
          this.bank.bankCode = this.bank.bankCode || null;
          this.bank.minAge = this.bank.minAge || null;
          this.bank.maxAge = this.bank.maxAge || null;
          this.bank.companyCategoryTypes = companyCategoryType;
          if (this.bank.bankLogo) {
            let bankLogo = this.bank.bankLogo.split(',')[1];
            this.bank.bankLogo = bankLogo
          }
          let res = await this.bankService.insertBank(this.bank, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getBanks();
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.bankform.controls).forEach(key => {
          this.bankform.controls[key].markAsTouched();
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

  public changeStatus(bank: Bank) {
    let active = bank.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Bank",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.bankService.activeInactiveBank(bank.id, bank.isActive, this.token);
          if (res && res.status == 200) {
            this.getBanks();
            Swal.fire(
              active,
              'Successfully ' + active + ' Bank',
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
      else {
        bank.isActive = !bank.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public clearSearch() {
    this.searchString = null;
    this.getBanks();
  }

  public modalOpen(basicmodal: any) {
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
    this.title = "Insert Bank";
    this.bank = new Bank();
    this.isShowParentSelection = true;
    this.selectedBank = this.banks;
    this.bankform.reset();
    this.bank.companyCategoryTypes = [];
    this.bank.companyCategoryTypes.push(this.companyCategoryTypes[0])
    this.companyCategoryType = this.companyCategoryTypes[0].id
    this.bank.companyCategoryTypes[0].selectedCategory = [];
    this.bank.companyCategoryTypes[0].filterCategory = [];
    this.getCompanyCategory();
  }

  public editDialog(element: Bank, basicmodal) {
    this.title = "Edit Bank"
    this.bank = new Bank();
    this.bank = element;
    this.bankform.setValue({
      "name": this.bank.name,
      "description": this.bank.description,
      "headquarters": this.bank.headquarters,
      "bankCode": this.bank.bankCode,
      "minAge": this.bank.minAge,
      "maxAge": this.bank.maxAge,
      "bankLogo": this.bank.bankLogo ? this.bank.bankLogo : null
    })
    // this.modalService.open(basicmodal, { size: 'xl' });
    this.modalService.open(basicmodal, {size: 'xl',windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.selectedBank = this.banks.filter(c => c.id != element.id);
    if (element.companyCategoryTypes && element.companyCategoryTypes.length > 0) {
      this.companyCategoryType = element.companyCategoryTypes[element.companyCategoryTypes.length - 1].id
      element.companyCategoryTypes.forEach(typeelement => {
        typeelement.filterCategory = typeelement.selectedCategory
      });
    }
    else {
      this.bank.companyCategoryTypes = [];
      this.companyCategoryType = this.companyCategoryTypes[0].id
      this.bank.companyCategoryTypes.push(this.companyCategoryTypes[0])
    }
    this.getCompanyCategory()
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }


  public async getCompanyCategoryType() {
    try {
      this.spinnerService.show();
      let res = await this.bankCreditCardService.getCompanyCategoryTypes(null, null, this.token);
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

  public getCompanyCategory(event?: any, selected?) {
    if (event) {
      if (selected) {
        this.bank.companyCategoryTypes.forEach(ele => {
          ele.filterCategory = ele.selectedCategory.filter(c => c.companyName.toLowerCase().includes((event.target.value).toLowerCase()))
        });
      } else {
        let ids = [];
        this.companyCategory = (JSON.parse((localStorage.getItem("CompanyCategory"))) as any[]).filter(c => c.companyName.toLowerCase().includes((event.target.value).toLowerCase())).slice(0, 50);
        if (this.companyCategory && this.companyCategory.length > 0) {
          if (this.bank.companyCategoryTypes && this.bank.companyCategoryTypes.length > 0) {
            this.bank.companyCategoryTypes.forEach(ele => {
              if (ele.selectedCategory && ele.selectedCategory.length > 0) {
                ele.selectedCategory.forEach(categoryEle => {
                  this.companyCategory = this.companyCategory.filter(c => c.id != categoryEle.id)
                })
              }
            })
          }
        }
        this.companyCategory = [...this.companyCategory]
      }
    }
    else {
      this.companyCategory = (JSON.parse((localStorage.getItem("CompanyCategory"))) as any[]).slice(0, 50);
      if (this.companyCategory && this.companyCategory.length > 0) {
        if (this.bank.companyCategoryTypes && this.bank.companyCategoryTypes.length > 0) {
          this.bank.companyCategoryTypes.forEach(ele => {
            if (ele.selectedCategory && ele.selectedCategory.length > 0) {
              ele.selectedCategory.forEach(categoryEle => {
                this.companyCategory = this.companyCategory.filter(c => c.id != categoryEle.id)
              })
            }
          })
        }
      }
      this.companyCategory = [...this.companyCategory]
    }
  }

  public changeCompanyCategoryType() {
    let companyCategoryType = this.companyCategoryTypes.find(c => c.id == this.companyCategoryType)
    let index = this.bank.companyCategoryTypes.findIndex(c => c.id == this.companyCategoryType)
    if (index < 0) {
      this.bank.companyCategoryTypes.push(companyCategoryType);
      this.bank.companyCategoryTypes[this.bank.companyCategoryTypes.length - 1].selectedCategory = [];
      this.bank.companyCategoryTypes[this.bank.companyCategoryTypes.length - 1].filterCategory = [];
    }
  }

  public addInSelectedCategory(event, item, index) {

    if (event.target.checked) {

      let typeIndex = this.bank.companyCategoryTypes.findIndex(c => c.id == this.companyCategoryType)
      if (!this.bank.companyCategoryTypes[typeIndex].selectedCategory) {
        this.bank.companyCategoryTypes[typeIndex].selectedCategory = [];
        this.bank.companyCategoryTypes[typeIndex].filterCategory = [];
      }
      this.bank.companyCategoryTypes[typeIndex].selectedCategory.push(item);
      this.bank.companyCategoryTypes[typeIndex].filterCategory = this.bank.companyCategoryTypes[typeIndex].selectedCategory
      this.bank.companyCategoryTypes = [...this.bank.companyCategoryTypes]
      this.companyCategory.splice(index, 1)
    }

  }

  public removeFromSelectedCategory(event, item, categoryType) {
    let index = this.bank.companyCategoryTypes.findIndex(c => c.id == categoryType.id)
    let categoryIndex = this.bank.companyCategoryTypes[index].selectedCategory.findIndex(c => c.companyName == item.companyName)
    this.bank.companyCategoryTypes[index].selectedCategory.splice(categoryIndex, 1)
    this.bank.companyCategoryTypes[index].filterCategory = this.bank.companyCategoryTypes[index].selectedCategory
    this.companyCategory.push(item)

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

  public async selectedImage(e: any) {
    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        this.bankform.get('bankLogo').setValue(image)
      }

    }
  }

}