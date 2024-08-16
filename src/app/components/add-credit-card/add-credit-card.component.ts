import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CreditCard } from 'src/app/shared/models/credit-card';
import { Maritalstatuses } from 'src/app/shared/models/maritalstatuses';
import { BankService } from 'src/app/shared/services/bank.service';
import { CreditCardService } from 'src/app/shared/services/credit-card.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { DsaService } from 'src/app/shared/services/dsa.service';
import { EmploymentTypeService } from 'src/app/shared/services/employmentType.service';
import { MaritalStautusesService } from 'src/app/shared/services/maritalstatus.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';

@Component({
  selector: 'app-add-credit-card',
  templateUrl: './add-credit-card.component.html',
  styleUrls: ['./add-credit-card.component.scss']
})
export class AddCreditCardComponent implements OnInit {

  public token: string;
  public isAlert: boolean;
  public credit: any;
  public url: string;
  public picType: string;
  private alertMessage: string;
  public creditCards: CreditCard[] = new Array<CreditCard>();
  public creditCard: any = new CreditCard();
  public isSameAddress = new FormControl();
  public communicationAdressId = new FormControl();
  public banks = [];
  public employmentTypes = [];
  public maritalStatuses: Maritalstatuses[] = new Array<Maritalstatuses>();
  public customerId: number
  public cities = [];
  public workAddressCities = [];
  public permanentAddressCities = [];
  public educationTypes = [];
  public customer;
  public customerCreditCardId: number
  public eligibleCreditCards = [];
  public displayColumns = ['id', 'creditCard', 'bnakCreditCard', 'joiningfee', 'renualfee']
  public selectedbank: number
  public selectedBankCreditCard = [];
  public selectedCreditCardId: number

  public creditCardForm = new FormGroup({
    "fullName": new FormControl('', [Validators.required]),
    "birthdate": new FormControl('', Validators.required),
    "email": new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    "panCardNo": new FormControl(null, [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    "gender": new FormControl('', Validators.required),
    "maritalStatusId": new FormControl('', Validators.required),
    "employmentTypeId": new FormControl('', Validators.required),
    "bankId": new FormControl('', Validators.required),
    "bankAccountNo": new FormControl('', Validators.required),
    "lastItr": new FormControl(null, Validators.required),
    "educationTypeId": new FormControl('', Validators.required),
    "officeContactNo": new FormControl('', Validators.required),
    "isAlreadyCreditCard": new FormControl('', Validators.required),
    "companyName": new FormControl(),
  })

  public otherCreditCardForm = new FormGroup({
    "maxCreditLimit": new FormControl('', Validators.required),
    "otherCreditCardBankId": new FormControl(),
    "availableCreditLimit": new FormControl('', Validators.required),
  })

  public correspondenceAddressForm = new FormGroup({
    "label": new FormControl('', Validators.required),
    "addressLine1": new FormControl('', Validators.required),
    "addressLine2": new FormControl(''),
    "pincode": new FormControl('', Validators.required),
    "district": new FormControl('', Validators.required),
    "state": new FormControl('', Validators.required),
    "cityId": new FormControl('', Validators.required),
  })
  public permanentAddressForm = new FormGroup({
    "label": new FormControl('', Validators.required),
    "addressLine1": new FormControl('', Validators.required),
    "addressLine2": new FormControl(''),
    "pincode": new FormControl('', Validators.required),
    "district": new FormControl('', Validators.required),
    "state": new FormControl('', Validators.required),
    "cityId": new FormControl('', Validators.required),
  });

  public workAddressForm = new FormGroup({
    "label": new FormControl('', Validators.required),
    "addressLine1": new FormControl('', Validators.required),
    "addressLine2": new FormControl(''),
    "pincode": new FormControl('', Validators.required),
    "district": new FormControl('', Validators.required),
    "state": new FormControl('', Validators.required),
    "cityId": new FormControl('', Validators.required),
  })

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private dsaService: DsaService,
    private route: ActivatedRoute,
    private router: Router,
    private bankService: BankService,
    private employmentTypeService: EmploymentTypeService,
    private maritalStautusesService: MaritalStautusesService,
    private creditCardService: CreditCardService,
    private customerService: CustomerService,
    private modalService: NgbModal,
    public toggleMenuService: ToggleMenuService
  ) { }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    this.creditCardForm.patchValue({ gender: "Male", isAlreadyCreditCard: "Yes" })
    this.route.params.subscribe(async (params) => {
      this.customerId = params['customerId'];
    });
    this.route.params.subscribe(async (params) => {
      this.customerCreditCardId = params['id'];
    });
    if (this.customerCreditCardId) {
      await this.getCreditCardById(this.customerCreditCardId);
    }
    // this.creditCardForm.patchValue({ gender: 'Male', maritalStatusId: 2, isAlreadyCreditCard: 'No' })
    await this.getBanks();
    await this.getMaritalStatuses();
    await this.getEmploymentTypes();
    await this.getEducationTypes();
    if (this.customerId) {
      await this.getCustomer()
    }

    this.isSameAddress.setValue("No")
    this.communicationAdressId.setValue("1")
  }

  private async getCreditCardById(creditCardId: number) {
    try {
      this.spinnerService.show();
      let res = await this.creditCardService.getCreditCardById(creditCardId, this.token)
      if (res && res.status == 200) {
        this.creditCard = res.recordList

        this.creditCardForm.setValue({
          "fullName": this.creditCard.customerDetail.fullName,
          "birthdate": this.creditCard.customerDetail.birthDate,
          "email": this.creditCard.customerDetail.email ? this.creditCard.customerDetail.email : null,
          "panCardNo": this.creditCard.customerDetail.panCardNo,
          "gender": this.creditCard.customerDetail.gender,
          "maritalStatusId": this.creditCard.customerDetail.maritalStatusId,
          "employmentTypeId": this.creditCard.employmentDetail.employmentTypeId ? this.creditCard.employmentDetail.employmentTypeId : null,
          "bankId": this.creditCard.employmentDetail.bankId ? this.creditCard.employmentDetail.bankId : null,
          "bankAccountNo": this.creditCard.employmentDetail.bankAccountNo ? this.creditCard.employmentDetail.bankAccountNo : null,
          "lastItr": this.creditCard.employmentDetail.lastItr ? this.creditCard.employmentDetail.lastItr : null,
          "educationTypeId": this.creditCard.employmentDetail.educationTypeId ? this.creditCard.employmentDetail.educationTypeId : null,
          "officeContactNo": this.creditCard.employmentDetail.officeContactNo ? this.creditCard.employmentDetail.officeContactNo : null,
          "isAlreadyCreditCard": this.creditCard.isAlreadyCreditCard ? "yes" : "No",
          "companyName": this.creditCard.employmentDetail.companyName ? this.creditCard.employmentDetail.companyName : null
        });
        if (this.creditCard.isAlreadyCreditCard) {
          this.otherCreditCardForm.setValue({
            "maxCreditLimit": this.creditCard.maxCreditLimit,
            "otherCreditCardBankId": this.creditCard.otherCreditCardBankId,
            "availableCreditLimit": this.creditCard.availableCreditLimit
          })
        }
        if (this.creditCard.correspondenceAddressDetail?.addressId) {
          if (this.creditCard.correspondenceAddressDetail.pincode) {
            this.getCityByPincode(this.creditCard.correspondenceAddressDetail.pincode, "present", false)
          }
          this.correspondenceAddressForm.setValue({
            "label": this.creditCard.correspondenceAddressDetail.label ? this.creditCard.correspondenceAddressDetail.label : null,
            "addressLine1": this.creditCard.correspondenceAddressDetail.addressLine1 ? this.creditCard.correspondenceAddressDetail.addressLine1 : null,
            "addressLine2": this.creditCard.correspondenceAddressDetail?.addressLine2 ? this.creditCard.correspondenceAddressDetail.addressLine2 : null,
            "pincode": this.creditCard.correspondenceAddressDetail.pincode,
            "district": this.creditCard.correspondenceAddressDetail.district,
            "state": this.creditCard.correspondenceAddressDetail.state,
            "cityId": this.creditCard.correspondenceAddressDetail.cityId,
          })
        }
        if (this.creditCard.workAddressDetail?.addressId) {
          if (this.creditCard.workAddressDetail.pincode) {
            this.getCityByPincode(this.creditCard.workAddressDetail.pincode, "work", false)
          }
          this.workAddressForm.setValue({
            "label": this.creditCard.workAddressDetail.label,
            "addressLine1": this.creditCard.workAddressDetail.addressLine1 ? this.creditCard.workAddressDetail.addressLine1 : null,
            "addressLine2": this.creditCard.workAddressDetail?.addressLine2 ? this.creditCard.workAddressDetail.addressLine2 : null,
            "pincode": this.creditCard.workAddressDetail.pincode,
            "district": this.creditCard.workAddressDetail.district,
            "state": this.creditCard.workAddressDetail.state,
            "cityId": this.creditCard.workAddressDetail.cityId,
          })
        }
        if (this.creditCard.customerDetail?.customerAddressId) {
          if (this.creditCard.customerDetail.pincode) {
            this.getCityByPincode(this.creditCard.customerDetail.pincode, "permanent", false)
          }
          this.permanentAddressForm.setValue({
            "label": this.creditCard.customerDetail.label ? this.creditCard.customerDetail.label : null,
            "addressLine1": this.creditCard.customerDetail.addressLine1 ? this.creditCard.customerDetail.addressLine1 : null,
            "addressLine2": this.creditCard.customerDetail.addressLine2 ? this.creditCard.customerDetail.addressLine2 : null,
            "pincode": this.creditCard.customerDetail.pincode,
            "district": this.creditCard.customerDetail.district,
            "state": this.creditCard.customerDetail.state,
            "cityId": this.creditCard.customerDetail.cityId,
          })
        }
        if (this.creditCard.customerDetail?.customerAddressId) {
          if ((this.creditCard.customerDetail.addressLine1 && (this.creditCard.customerDetail.addressLine1 == this.creditCard.correspondenceAddressDetail.addressLine1)) &&
            (this.creditCard.customerDetail.addressLine2 && (this.creditCard.customerDetail.addressLine2 == this.creditCard.correspondenceAddressDetail.addressLine2)) &&
            this.creditCard.customerDetail.label == this.creditCard.correspondenceAddressDetail.label &&
            this.creditCard.customerDetail.cityId == this.creditCard.correspondenceAddressDetail.cityId &&
            this.creditCard.customerDetail.pincode == this.creditCard.correspondenceAddressDetail.pincode) {
            this.isSameAddress.setValue("yes")
          }
          else {
            this.isSameAddress.setValue("No")
          }
        }
        else {
          this.isSameAddress.setValue("yes")
        }
        this.communicationAdressId.setValue(this.creditCard.communicationAddressId ? this.creditCard.communicationAddressId.toString() : null)
        if (this.creditCard.creditCardOffer) {
          this.selectedCreditCardId = this.creditCard.creditCardOffer?.bankCreditCardId
        }

      }

      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.error.message) {
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


  public async getCustomer() {
    try {
      this.spinnerService.show();
      let res = await this.customerService.getCustomer(null, null, this.customerId, this.token);
      if (res && res.status == 200) {
        this.customer = res.recordList;
        this.creditCardForm.get("fullName").setValue(this.customer[0].fullName ? this.customer[0].fullName : null)
        this.creditCardForm.get("panCardNo").setValue(this.customer[0].panCardNo ? this.customer[0].panCardNo : null)
        this.creditCardForm.get("birthdate").setValue(this.customer[0].birthdate ? this.customer[0].birthdate : null)
        this.creditCardForm.get("maritalStatusId").setValue(this.customer[0].maritalStatusId ? this.customer[0].maritalStatusId : null)
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

  public async selectedImage(e: any) {
    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        let photoType = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf(".") + 1);
        this.picType = photoType;
        this.url = image;
        this.creditCardForm.patchValue({
          lastItr: reader.result
        });
      }
    }
  }

  public async getMaritalStatuses() {
    try {
      this.spinnerService.show();
      let res = await this.maritalStautusesService.getMaritalStatuses(null, this.token);
      if (res && res.status == 200) {
        this.maritalStatuses = res.recordList;
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

  public async getEducationTypes() {
    try {
      this.spinnerService.show();
      let res = await this.creditCardService.getEducationType(this.token);
      if (res && res.status == 200) {
        this.educationTypes = res.recordList;
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

  public async getBanks() {
    try {
      this.spinnerService.show();
      let res = await this.bankService.getBanks(null, null, null, this.token);
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

  public navigateCreditCardList() {
    this.router.navigate(["/creditCard"])
  }

  public async insertCreditCard(basicmodal) {
    try {
      let creditCard = this.creditCard
      if (this.creditCardForm.valid) {
        this.selectedCreditCardId = null
        if (this.correspondenceAddressForm.valid) {
          let correspondenceAddress: any;
          let permanentAddress: any;
          if (this.isSameAddress.value == "yes") {
            this.permanentAddressForm.setValue({
              "label": this.correspondenceAddressForm.get('label').value,
              "addressLine1": this.correspondenceAddressForm.get('addressLine1').value,
              "addressLine2": this.correspondenceAddressForm.get('addressLine2').value,
              "pincode": this.correspondenceAddressForm.get('pincode').value,
              "cityId": this.correspondenceAddressForm.get('cityId').value,
              "state": this.correspondenceAddressForm.get('state').value,
              "district": this.correspondenceAddressForm.get('district').value
            })
          }
          correspondenceAddress = this.correspondenceAddressForm.value;
          permanentAddress = this.permanentAddressForm.value;
          permanentAddress.customerAddressId = this.creditCard.permanentAddressDetail?.customerAddressId ? this.creditCard.permanentAddressDetail.customerAddressId : null
          correspondenceAddress.customerAddressId = this.creditCard.correspondenceAddressDetail?.correspondenceAddressDetail.customerAddressId ? this.creditCard.correspondenceAddressDetail.customerAddressId : null
          permanentAddress.addressTypeId = 1;
          correspondenceAddress.addressTypeId = 3;

          if (this.permanentAddressForm.valid) {
            if (this.workAddressForm.valid) {
              let creditCardId = this.creditCard.id ? this.creditCard.id : null;
              let creditCardEmploymentDetailId = this.creditCard.employmentDetail?.id ? this.creditCard.employmentDetail.id : null;
              permanentAddress.customerAddressId = this.creditCard.customerDetail?.customerAddressId ? this.creditCard.customerDetail.customerAddressId : null;
              correspondenceAddress.customerAddressId = this.creditCard.correspondenceAddressDetail?.addressId ? this.creditCard.correspondenceAddressDetail.addressId : null;
              let workAddressId = this.creditCard.workAddressDetail?.addressId ? this.creditCard.workAddressDetail.addressId : null;
              this.creditCard = this.creditCardForm.value;
              this.creditCard.customerWorkAddresses = this.workAddressForm.value
              this.creditCard.customerWorkAddresses.addressTypeId = 2
              this.creditCard.customerWorkAddresses.customerAddressId = workAddressId
              this.creditCard.id = creditCardId;
              this.creditCard.customerId = this.customerId
              this.creditCard.communicationAddressId = this.communicationAdressId.value
              this.creditCard.customerAddresses = [];

              this.creditCard.customerAddresses.push(permanentAddress)
              this.creditCard.customerAddresses.push(correspondenceAddress)
              this.creditCard.userId = this.customer[0].userId
              this.creditCard.creditCardEmploymentDetailId = creditCardEmploymentDetailId
              this.creditCard.isAlreadyCreditCard = this.creditCardForm.get("isAlreadyCreditCard").value == 'yes' ? true : false
              let res = await this.creditCardService.insertUpdateCreditCard(this.creditCard, this.token)
              if (res && res.status == 200) {
                this.toastrService.success("SuccessFully Create Credit Card");
                try {
                  this.customerCreditCardId = res.recordList.creditCardId;
                  let elgibiltyRes = await this.creditCardService.creditCardEligibility(res.recordList.creditCardId, this.token)
                  if (elgibiltyRes && elgibiltyRes.status == 200) {
                    this.eligibleCreditCards = elgibiltyRes.recordList
                    if (this.eligibleCreditCards && this.eligibleCreditCards.length > 0) {
                      this.selectedbank = this.eligibleCreditCards[0].bankId
                      this.selectedBankCreditCard = this.eligibleCreditCards[0].creditCards;
                      if (this.selectedBankCreditCard && this.selectedBankCreditCard.length > 0) {
                        if (creditCard.creditCardOffer) {
                          this.selectedBankCreditCard.forEach(ele => {
                            ele.isSelected = (ele.id == creditCard.creditCardOffer?.bankCreditCardId) ? true : false
                          })
                        }
                      }
                    }
                  }
                  this.modalService.open(basicmodal, { size: 'lg', windowClass: 'custom-modal' });
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
            else {
              Object.keys(this.workAddressForm.controls).forEach(key => {
                this.workAddressForm.controls[key].markAsTouched();
              });
            }
          }
          else {
            Object.keys(this.permanentAddressForm.controls).forEach(key => {
              this.permanentAddressForm.controls[key].markAsTouched();
            });
          }
        }
        else {
          Object.keys(this.correspondenceAddressForm.controls).forEach(key => {
            this.correspondenceAddressForm.controls[key].markAsTouched();
          });
        }
      }
      else {
        Object.keys(this.creditCardForm.controls).forEach(key => {
          this.creditCardForm.controls[key].markAsTouched();
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

  public async onKeyUpEvent(event: any, category: string, isChangeCity) {
    try {
      if (event.target.value && event.target.value.length == 6) {
        await this.getCityByPincode(event.target.value, category, isChangeCity);

      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getCityByPincode(n, category: string, isChangeCity) {
    try {
      let res = await this.dsaService.getCityByPincode(null, n, this.token);
      if (res && res.status == 200) {
        if (category == "present") {
          this.cities = res.recordList;
          if (this.cities && this.cities.length > 0)
            if (isChangeCity) {
              this.correspondenceAddressForm.get("cityId").setValue(this.cities[0].id)
              this.correspondenceAddressForm.get("district").setValue(this.cities[0].districtName)
              this.correspondenceAddressForm.get("state").setValue(this.cities[0].stateName)
            }
        }
        if (category == "work") {
          this.workAddressCities = res.recordList;
          if (this.workAddressCities && this.workAddressCities.length > 0)
            if (isChangeCity) {
              this.workAddressForm.get("cityId").setValue(this.workAddressCities[0].id)
              this.workAddressForm.get("district").setValue(this.workAddressCities[0].districtName)
              this.workAddressForm.get("state").setValue(this.workAddressCities[0].stateName)
            }
        }
        if (category == "permanent") {
          this.permanentAddressCities = res.recordList;
          if (this.permanentAddressCities && this.permanentAddressCities.length > 0)
            if (isChangeCity) {
              this.permanentAddressForm.get("cityId").setValue(this.permanentAddressCities[0].id)
              this.permanentAddressForm.get("district").setValue(this.permanentAddressCities[0].districtName)
              this.permanentAddressForm.get("state").setValue(this.permanentAddressCities[0].stateName)
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

  public keyPressAlphanumeric(event) {
    let inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9 ]/.test(inp)) {
      // only alphabet a-z A-Z
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  public getSelectedBankCreditCard(creditCard) {
    this.selectedBankCreditCard = [];
    this.selectedBankCreditCard = this.eligibleCreditCards.find(c => c.bankId == creditCard.bankId).creditCards
    this.selectedbank = creditCard.bankId
    if (this.selectedBankCreditCard && this.selectedBankCreditCard.length > 0) {
      if (this.selectedCreditCardId) {
        this.selectedBankCreditCard.forEach(ele => {
          ele.isSelected = (ele.id == this.selectedCreditCardId) ? true : false
        })
      }
    }
    this.selectedBankCreditCard = [...this.selectedBankCreditCard]
  }

  public async insertSelectedBankCreditCard() {
    try {
      let bankCreditCardId: number
      for (let index = 0; index < this.eligibleCreditCards.length; index++) {
        for (let j = 0; j < this.eligibleCreditCards[index].creditCards.length; j++) {
          if (this.eligibleCreditCards[index].creditCards[j].isSelected == true) {
            bankCreditCardId = this.eligibleCreditCards[index].creditCards[j].id
            break;
          }
        }

      }
      let res = await this.creditCardService.insertCreditCardOffer(this.customerCreditCardId, bankCreditCardId, this.token)
      if (res && res.status == 200) {
        this.modalService.dismissAll();
        this.router.navigate(['/creditCard'])
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

  public changeSelectedCreditCard(creditCard) {
    this.eligibleCreditCards.forEach(ele => {
      ele.creditCards.forEach(creditele => {
        creditele.isSelected = false;
      })
    });
    this.selectedCreditCardId = creditCard.id
    this.selectedBankCreditCard[this.selectedBankCreditCard.findIndex(c => c.id == creditCard.id)].isSelected = true;
  }

  public debugBase64(base64URL) {
    let win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }
}