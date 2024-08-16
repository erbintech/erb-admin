import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/shared/models/bank';
import { BankCreditCard } from 'src/app/shared/models/bankCreditCard';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BankService } from 'src/app/shared/services/bank.service';
import { BankCreditCardService } from 'src/app/shared/services/bankCreditCard.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

@Component({
  selector: 'app-bank-credit-card',
  templateUrl: './bank-credit-card.component.html',
  styleUrls: ['./bank-credit-card.component.scss']
})
export class BankCreditCardComponent implements OnInit {
  public banks: Bank[] = new Array<Bank>();
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
  public bankCreditCard = new BankCreditCard();
  public bankCreditCards: BankCreditCard[] = new Array<BankCreditCard>();
  public bankCreditCardForm: FormGroup
  public selectedBank: number
  public isRequired: boolean = true;
  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  }

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
    private bankCreditCardService: BankCreditCardService
  ) {
    this.bankCreditCardForm = formBuilder.group({
      "bankId": [null, [Validators.required]],
      "creditCardName": [null, [Validators.required]],
      "benifitDescription": [null, [Validators.required]],
      "keyFeatures": [null, [Validators.required]],
      "creditCardUrl": [null, [Validators.required]],
      "joiningfee": [null, [Validators.required]],
      "renualfee": [null, [Validators.required]],
    })
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'bankCreditCard');
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
    await this.getBanks();
    await this.setPage(1);
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getBankCreditCard();
    }
  }

  public async getBankCreditCard() {
    try {
      this.spinnerService.show();
      let res = await this.bankCreditCardService.getBankCredtiCard(this.startIndex, this.fetchRecord, this.selectedBank, this.token);
      if (res && res.status == 200) {
        this.bankCreditCards = res.recordList;
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


  public modalOpen(basicmodal: any) {

    this.title = "Insert Bank Credit Card";
    this.bankCreditCard = new BankCreditCard();
    this.bankCreditCardForm.reset();
    this.modalService.open(basicmodal, { size: "lg" });
  }

  public editDialog(element: BankCreditCard, basicmodal) {
    this.title = "Edit Bank Credit Card"
    this.bankCreditCard = new BankCreditCard();
    this.bankCreditCard = element;
    this.bankCreditCardForm.setValue({
      "bankId": this.bankCreditCard.bankId,
      "creditCardName": this.bankCreditCard.creditCardName,
      "benifitDescription": this.bankCreditCard.benifitDescription,
      "keyFeatures": this.bankCreditCard.keyFeatures,
      "joiningfee": this.bankCreditCard.joiningfee,
      "renualfee": this.bankCreditCard.renualfee,
      "creditCardUrl": this.bankCreditCard.creditCardUrl
    })
    this.modalService.open(basicmodal, { size: "lg" });
  }

  public closeDialog() {
    this.bankCreditCard = new BankCreditCard();
    this.modalService.dismissAll();
  }

  public async selectedImage(e: any) {

    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        this.bankCreditCardForm.get("creditCardUrl").setValue(image)
      }

    }
  }

  public async insertBankCreditCard(form) {
    if (form.valid) {
      try {
        this.spinnerService.show();
        let id = this.bankCreditCard.id ? this.bankCreditCard.id : null;
        this.bankCreditCard = this.bankCreditCardForm.value;
        this.bankCreditCard.id = id;
        if (this.bankCreditCard.creditCardUrl && !this.bankCreditCard.creditCardUrl.includes("https:")) {
          let creditCardImage = this.bankCreditCard.creditCardUrl.split(',')[1];
          this.bankCreditCard.creditCardUrl = creditCardImage
        }
        let res = await this.bankCreditCardService.insertBankCreditCard(this.bankCreditCard, this.token);
        if (res && res.status == 200) {
          await this.getBankCreditCard();
          this.modalService.dismissAll();
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

  public clearSearch() {
    this.selectedBank = null;
    this.getBankCreditCard();
  }
}
